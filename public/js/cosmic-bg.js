(function initCosmicBackground() {

  /* ── 1. SHOOTING STARS (8) ───────────────────────────────────── */
  if (!document.querySelector('.cosmic-shooting-stars')) {
    const shooting = document.createElement('div');
    shooting.className = 'cosmic-shooting-stars';
    for (let i = 0; i < 8; i++) {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      shooting.appendChild(star);
    }
    document.body.prepend(shooting);
  }

  /* ── 2. DENSE 3-TIER STAR FIELD ─────────────────────────────── */
  if (!document.querySelector('.cosmic-stars-tiny')) {
    function makeStars(count, sizePx, baseOpacity, tintPurple) {
      const stops = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const a = (baseOpacity + Math.random() * 0.25).toFixed(2);
        const usePurple = tintPurple && Math.random() > 0.55;
        const color = usePurple ? `192,178,255` : `255,255,255`;
        stops.push(`radial-gradient(${sizePx}px ${sizePx}px at ${x}% ${y}%, rgba(${color},${a}) 0, transparent 100%)`);
      }
      return stops.join(',\n    ');
    }

    // Twinkle keyframes (one per tier so they flicker independently)
    const style = document.createElement('style');
    style.textContent = `
      .cosmic-stars-tiny {
        background-image: ${makeStars(90, 1, 0.12, true)};
      }
      .cosmic-stars-medium {
        background-image: ${makeStars(45, 1.5, 0.22, true)};
        animation-duration: 90s;
      }
      .cosmic-stars-bright {
        background-image: ${makeStars(18, 2, 0.45, false)};
        animation-duration: 60s;
      }
      @keyframes twinkleTiny {
        0%,100%{opacity:0.5} 25%{opacity:0.9} 50%{opacity:0.35} 75%{opacity:0.75}
      }
      @keyframes twinkleMed {
        0%,100%{opacity:0.7} 30%{opacity:1}   60%{opacity:0.45}
      }
      @keyframes twinkleBright {
        0%,100%{opacity:0.8} 40%{opacity:1}   70%{opacity:0.55}
      }
      .cosmic-stars-tiny   { animation: starsDriftSlow 120s linear infinite, twinkleTiny   6s ease-in-out infinite; }
      .cosmic-stars-medium { animation: starsDriftMed   90s linear infinite, twinkleMed    4s ease-in-out infinite; }
      .cosmic-stars-bright { animation: starsDriftFast  60s linear infinite, twinkleBright 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);

    const tiny   = document.createElement('div'); tiny.className   = 'cosmic-stars-tiny';
    const medium = document.createElement('div'); medium.className = 'cosmic-stars-medium';
    const bright = document.createElement('div'); bright.className = 'cosmic-stars-bright';
    document.body.prepend(bright);
    document.body.prepend(medium);
    document.body.prepend(tiny);
  }

  /* ── 3. EXTRA NEBULA BLOBS (injected into .bg-anim) ─────────── */
  const bgAnim = document.querySelector('.bg-anim');
  if (bgAnim && !bgAnim.querySelector('.nebula-blob')) {
    const blobs = [
      { w: 700, h: 500, top: '20%',  left: '55%',  color: 'rgba(100,60,255,0.07)',  dur: 62 },
      { w: 500, h: 600, top: '55%',  left: '10%',  color: 'rgba(200,80,255,0.06)',  dur: 48 },
      { w: 600, h: 400, top: '-5%',  left: '30%',  color: 'rgba(80,120,255,0.05)',  dur: 70 },
    ];
    blobs.forEach((b, i) => {
      const el = document.createElement('div');
      el.className = 'nebula-blob';
      Object.assign(el.style, {
        width:      b.w + 'px',
        height:     b.h + 'px',
        top:        b.top,
        left:       b.left,
        background: `radial-gradient(ellipse, ${b.color} 0%, transparent 70%)`,
        animationName:           'nebulaFloat' + (i % 2 === 0 ? '1' : '2'),
        animationDuration:       b.dur + 's',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDelay:          (i * 8) + 's',
      });
      bgAnim.appendChild(el);
    });
  }

})();
