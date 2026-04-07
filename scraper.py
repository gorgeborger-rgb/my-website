import threading
import time
from datetime import datetime, timezone

from bs4 import BeautifulSoup
from flask import Flask, jsonify
from flask_cors import CORS
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout


PASSWORD = "support"
BASE = "https://support.cosmotickets.com/status/"
REFRESH_SECONDS = 60
PORT = 5050

BRANDS = [
    {"id": "all", "name": "All Brands", "url": f"{BASE}status.php?brand=all"},
    {"id": "AstroZoom", "name": "AstroZoom", "url": f"{BASE}status.php?brand=AstroZoom"},
    {"id": "Athena", "name": "Athena", "url": f"{BASE}status.php?brand=Athena"},
    {"id": "Atlas", "name": "Atlas", "url": f"{BASE}status.php?brand=Atlas"},
    {"id": "Forge", "name": "Forge", "url": f"{BASE}status.php?brand=Forge"},
    {"id": "Hero", "name": "Hero", "url": f"{BASE}status.php?brand=Hero"},
    {"id": "Kane", "name": "Kane", "url": f"{BASE}status.php?brand=Kane"},
    {"id": "Liquid", "name": "Liquid", "url": f"{BASE}status.php?brand=Liquid"},
    {"id": "Pulse", "name": "Pulse", "url": f"{BASE}status.php?brand=Pulse"},
    {"id": "Vex", "name": "Vex", "url": f"{BASE}status.php?brand=Vex"},
    {"id": "Viper", "name": "Viper", "url": f"{BASE}status.php?brand=Viper"},
    {"id": "Volt", "name": "Volt", "url": f"{BASE}status.php?brand=Volt"},
]


def normalize_status(raw: str) -> str:
    s = (raw or "").strip().lower()
    if "updat" in s:
        return "Updating"
    if "test" in s:
        return "Testing"
    if "maintenance" in s:
        return "Maintenance"
    if "offline" in s or "down" in s or "unavail" in s:
        return "Offline"
    if "online" in s or "operational" in s or "working" in s:
        return "Online"
    return (raw or "Unknown").strip() or "Unknown"


def overall_status(products):
    if not products:
        return "Unknown"
    states = [p["status"].lower() for p in products]
    if any("updat" in s for s in states):
        return "Updating"
    if any("test" in s for s in states):
        return "Testing"
    if any("maintenance" in s for s in states):
        return "Maintenance"
    if any("offline" in s or "down" in s for s in states):
        return "Offline"
    if all("online" in s or "operational" in s for s in states):
        return "Online"
    return products[0]["status"]


def parse_products(html: str):
    soup = BeautifulSoup(html, "html.parser")
    products = []

    # Main pattern used by cosmotickets status dashboard
    for card in soup.select(".games-grid .game-card"):
        name_el = card.select_one(".game-name")
        status_el = card.select_one(".status-text")
        if not name_el or not status_el:
            continue
        name = name_el.get_text(" ", strip=True)
        status = status_el.get_text(" ", strip=True)
        if name and 1 < len(name) < 80:
            products.append({"name": name, "status": normalize_status(status)})

    if products:
        return dedupe_products(products)

    # Backup patterns
    for tr in soup.select("tr"):
        tds = tr.find_all("td")
        if len(tds) >= 2:
            name = tds[0].get_text(" ", strip=True)
            status = tds[1].get_text(" ", strip=True)
            if name and 1 < len(name) < 64 and "product" not in name.lower():
                products.append({"name": name, "status": normalize_status(status)})

    return dedupe_products(products)


def dedupe_products(products):
    seen = set()
    out = []
    for p in products:
        key = (p["name"].lower(), p["status"].lower())
        if key not in seen:
            seen.add(key)
            out.append(p)
    return out


def is_login_page(page):
    try:
        content = page.content()
        return "Status Login" in content or "name=\"password\"" in content
    except Exception:
        return True


def do_login(page):
    page.goto(BRANDS[0]["url"], wait_until="domcontentloaded", timeout=45000)
    if not is_login_page(page):
        return True

    try:
        page.fill("input[name='password']", PASSWORD, timeout=7000)
        page.click("button[type='submit']", timeout=7000)
        page.wait_for_timeout(1500)
        page.wait_for_load_state("domcontentloaded", timeout=20000)
    except PlaywrightTimeout:
        return False

    return not is_login_page(page)


class StatusScraper:
    def __init__(self):
        self.lock = threading.Lock()
        self.cache = {
            "success": False,
            "brands": [],
            "lastUpdated": None,
            "error": "not-initialized",
        }
        self.last_good_cache = None

    def run_once(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            logged = do_login(page)

            results = []
            for brand in BRANDS:
                try:
                    page.goto(brand["url"], wait_until="domcontentloaded", timeout=45000)
                    if is_login_page(page):
                        logged = do_login(page)
                        page.goto(brand["url"], wait_until="domcontentloaded", timeout=45000)

                    html = page.content()
                    if is_login_page(page):
                        results.append({
                            "brand": brand["name"],
                            "status": "Login Required",
                            "products": [],
                        })
                        continue

                    products = parse_products(html)
                    results.append({
                        "brand": brand["name"],
                        "status": overall_status(products),
                        "products": products,
                    })
                except Exception as ex:
                    results.append({
                        "brand": brand["name"],
                        "status": "Error",
                        "products": [],
                        "error": str(ex),
                    })

            browser.close()

        total_products = 0
        updating_count = 0
        testing_count = 0
        login_required_brands = 0
        for brand in results:
            if brand.get("status") == "Login Required":
                login_required_brands += 1
            for product in brand.get("products", []):
                total_products += 1
                st = str(product.get("status", "")).lower()
                if "updat" in st:
                    updating_count += 1
                elif "test" in st:
                    testing_count += 1

        payload = {
            "success": True,
            "brands": results,
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "loggedIn": logged,
            "stats": {
                "totalProducts": total_products,
                "updating": updating_count,
                "testing": testing_count,
                "loginRequiredBrands": login_required_brands,
            },
        }

        if total_products == 0 and self.last_good_cache:
            fallback = dict(self.last_good_cache)
            fallback["lastUpdated"] = datetime.now(timezone.utc).isoformat()
            fallback["staleFallback"] = True
            fallback["staleReason"] = "zero-products-scraped"
            fallback["lastScrapeStats"] = payload["stats"]
            with self.lock:
                self.cache = fallback
            return fallback

        if total_products > 0:
            payload["staleFallback"] = False
            self.last_good_cache = payload

        with self.lock:
            self.cache = payload
        return payload

    def get_cache(self):
        with self.lock:
            return self.cache


scraper = StatusScraper()
app = Flask(__name__)
CORS(app)


@app.get("/api/status")
def api_status():
    return jsonify(scraper.get_cache())


def loop_refresh():
    while True:
        try:
            data = scraper.run_once()
            print(f"[{data['lastUpdated']}] refreshed {len(data['brands'])} brands")
        except Exception as ex:
            print(f"refresh error: {ex}")
        time.sleep(REFRESH_SECONDS)


if __name__ == "__main__":
    t = threading.Thread(target=loop_refresh, daemon=True)
    t.start()
    app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)
