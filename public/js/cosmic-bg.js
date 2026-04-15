(function initCosmicBackground() {

  /* ═══════════════════════════════════════════════════════════════
     1. SHOOTING STARS — wrapper/inner pattern
        Wrapper holds position + angle (never animated).
        Inner only animates translateX — preserving the angle.
  ═══════════════════════════════════════════════════════════════ */
  if (!document.querySelector('.cosmic-shooting-stars')) {
    const configs = [
      { w: 160, top: '11%', left: '76%', angle: -22, dur: 4.2,  delay: 0.3  },
      { w:  95, top: '27%', left: '89%', angle: -38, dur: 3.4,  delay: 1.8  },
      { w: 210, top:  '7%', left: '53%', angle: -14, dur: 5.9,  delay: 3.1  },
      { w: 130, top: '43%', left: '83%', angle: -30, dur: 4.7,  delay: 0.9  },
      { w:  85, top: '61%', left: '71%', angle: -46, dur: 3.1,  delay: 3.6  },
      { w: 185, top: '17%', left: '40%', angle: -12, dur: 6.2,  delay: 5.4  },
      { w: 115, top: '74%', left: '91%', angle: -33, dur: 4.4,  delay: 4.2  },
      { w:  70, top: '36%', left: '62%', angle: -54, dur: 2.9,  delay: 7.1  },
    ];

    const container = document.createElement('div');
    container.className = 'cosmic-shooting-stars';

    configs.forEach(c => {
      const wrap = document.createElement('div');
      wrap.className = 'shooting-star-wrap';
      wrap.style.cssText =
        `top:${c.top}; left:${c.left}; width:${c.w}px;` +
        `transform:rotate(${c.angle}deg); transform-origin: left center;`;

      const inner = document.createElement('div');
      inner.className = 'shooting-star-inner';
      inner.style.cssText =
        `width:${c.w}px;` +
        `animation-duration:${c.dur}s;` +
        `animation-delay:${c.delay}s;`;

      wrap.appendChild(inner);
      container.appendChild(wrap);
    });

    document.body.prepend(container);
  }

  /* ═══════════════════════════════════════════════════════════════
     2. DENSE 3-TIER STAR FIELD — pure twinkle, no vertical drift
  ═══════════════════════════════════════════════════════════════ */
  if (!document.querySelector('.cosmic-stars-tiny')) {
    function makeStars(count, sizePx, baseOpacity, tintPurple) {
      const stops = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const a = (baseOpacity + Math.random() * 0.2).toFixed(2);
        // mix white and purple tint
        const purple = tintPurple && Math.random() > 0.45;
        const rgb = purple ? '192,178,255' : '255,255,255';
        stops.push(
          `radial-gradient(${sizePx}px ${sizePx}px at ${x}% ${y}%, rgba(${rgb},${a}) 0, transparent 100%)`
        );
      }
      return stops.join(',\n    ');
    }

    const style = document.createElement('style');
    style.textContent = `
      .cosmic-stars-tiny {
        background-image: ${makeStars(100, 1,   0.10, true)};
        animation: twinkleTiny   8s ease-in-out infinite;
      }
      .cosmic-stars-medium {
        background-image: ${makeStars(50,  1.5, 0.20, true)};
        animation: twinkleMed    5s ease-in-out infinite;
      }
      .cosmic-stars-bright {
        background-image: ${makeStars(20,  2.5, 0.50, false)};
        animation: twinkleBright 3.5s ease-in-out infinite;
      }
      @keyframes twinkleTiny   { 0%,100%{opacity:0.45} 50%{opacity:0.85} }
      @keyframes twinkleMed    { 0%,100%{opacity:0.60} 50%{opacity:1.0}  }
      @keyframes twinkleBright { 0%,100%{opacity:0.70} 40%{opacity:1.0} 75%{opacity:0.50} }
    `;
    document.head.appendChild(style);

    ['cosmic-stars-tiny', 'cosmic-stars-medium', 'cosmic-stars-bright'].forEach(cls => {
      const el = document.createElement('div');
      el.className = cls;
      document.body.prepend(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     3. EXTRA NEBULA BLOBS in .bg-anim
  ═══════════════════════════════════════════════════════════════ */
  const bgAnim = document.querySelector('.bg-anim');
  if (bgAnim && !bgAnim.querySelector('.nebula-blob')) {
    const blobs = [
      { w: 700, h: 500, top: '22%',  left: '55%',  color: 'rgba(100,60,255,0.07)',  dur: 62, delay: 0  },
      { w: 500, h: 600, top: '55%',  left: '8%',   color: 'rgba(200,80,255,0.06)',  dur: 48, delay: 8  },
      { w: 600, h: 380, top: '-8%',  left: '32%',  color: 'rgba(80,120,255,0.05)',  dur: 70, delay: 16 },
    ];
    blobs.forEach((b, i) => {
      const el = document.createElement('div');
      el.className = 'nebula-blob';
      Object.assign(el.style, {
        width:                   b.w + 'px',
        height:                  b.h + 'px',
        top:                     b.top,
        left:                    b.left,
        background:              `radial-gradient(ellipse, ${b.color} 0%, transparent 70%)`,
        animationName:           'nebulaFloat' + (i % 2 === 0 ? '1' : '2'),
        animationDuration:       b.dur + 's',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDelay:          b.delay + 's',
      });
      bgAnim.appendChild(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     4. MOUSE PARALLAX on nebula layers
  ═══════════════════════════════════════════════════════════════ */
  (function initParallax() {
    const layers = [
      { el: document.querySelector('.bg-anim'), depth: 12 },
    ];
    let tx = 0, ty = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function tick() {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      layers.forEach(l => {
        if (l.el) {
          l.el.style.transform = `translate(${cx * l.depth}px, ${cy * l.depth}px)`;
        }
      });
      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ═══════════════════════════════════════════════════════════════
     5. 3D CARD TILT on hover
  ═══════════════════════════════════════════════════════════════ */
  (function initCardTilt() {
    function applyTilt() {
      const cards = document.querySelectorAll(
        '.hero-card, .stat-card, .command-card, .status-card, .fix-card, .brand-card'
      );
      cards.forEach(card => {
        if (card._tiltBound) return;
        card._tiltBound = true;

        card.addEventListener('mouseenter', () => {
          card.classList.add('tilt-card-enter');
          card.classList.remove('tilt-card-leave');
        });
        card.addEventListener('mousemove', e => {
          const r   = card.getBoundingClientRect();
          const x   = (e.clientX - r.left)  / r.width  - 0.5;
          const y   = (e.clientY - r.top)   / r.height - 0.5;
          const rx  = -y * 7;   // tilt around X axis
          const ry  =  x * 7;   // tilt around Y axis
          card.style.transform =
            `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px) translateY(-3px)`;
        });
        card.addEventListener('mouseleave', () => {
          card.classList.remove('tilt-card-enter');
          card.classList.add('tilt-card-leave');
          card.style.transform = '';
        });
      });
    }

    // Run now + re-run after dynamic content loads
    applyTilt();
    const obs = new MutationObserver(applyTilt);
    obs.observe(document.body, { childList: true, subtree: true });
  })();

})();
