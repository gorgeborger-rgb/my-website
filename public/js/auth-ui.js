// DevTools Blocker - Small popup only
(function() {
  var blocker = document.createElement('div');
  blocker.id = 'devtoolsBlocker';
  blocker.style.cssText = 'display:none;position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:12px 24px;border-radius:8px;z-index:999999;font-family:Inter,sans-serif;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
  blocker.textContent = '🚫 Access Denied - Developer tools not allowed';
  document.body.appendChild(blocker);
  
  var show = function() { 
    blocker.style.display = 'block';
    setTimeout(function() { blocker.style.display = 'none'; }, 3000);
  };
  
  setInterval(function() {
    var w = window.outerWidth - window.innerWidth;
    var h = window.outerHeight - window.innerHeight;
    if (w > 100 || h > 100) show();
  }, 500);
  
  document.addEventListener('keydown', function(e) {
    if ((e.key === 'F12') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') || ((e.ctrlKey || e.metaKey) && e.key === 'u')) {
      e.preventDefault();
      show();
    }
  });
  
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); show(); });
})();

// Auth check
(async function initAuthUI() {
  try {
    const resp = await cosmoFetch('/api/auth/me');
    const data = await resp.json();
    if (!data || !data.authenticated) {
      window.location.href = 'index.html';
      return;
    }

    if (data.canAdmin) {
      document.querySelectorAll('.admin-only').forEach((el) => {
        el.style.display = '';
      });
    }

    document.querySelectorAll('[data-logout]').forEach((el) => {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await cosmoFetch('/api/auth/logout', { method: 'POST' });
        } catch (_) {}
        window.location.href = 'index.html';
      });
    });
  } catch (_) {
    window.location.href = 'index.html';
  }
})();