(function initCosmicBackground() {
  if (document.querySelector('.cosmic-stars')) return;

  const stars = document.createElement('div');
  stars.className = 'cosmic-stars';

  const shooting = document.createElement('div');
  shooting.className = 'cosmic-shooting-stars';
  for (let i = 0; i < 3; i += 1) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    shooting.appendChild(star);
  }

  document.body.prepend(shooting);
  document.body.prepend(stars);
})();
