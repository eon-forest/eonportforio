(() => {
  const button = document.getElementById('portrait-toggle');
  if (!button) return;
  const normal = button.querySelector('.portrait-normal');
  const hero = button.querySelector('.portrait-hero');
  const heroImage = hero.querySelector('img');
  const light = button.querySelector('.transform-light');
  const hint = document.getElementById('portrait-hint');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let requested = false;
  let lastPointer = 'mouse';
  let sweep;

  function transform(next) {
    requested = next;
    if (next && (!heroImage.complete || !heroImage.naturalWidth)) return;
    if (active === next) return;
    active = next;
    button.classList.toggle('is-hero', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? '元のプロフィール写真に戻る' : 'ヒーロー姿に変身する');
    normal.setAttribute('aria-hidden', String(active));
    hero.setAttribute('aria-hidden', String(!active));
    if (sweep) sweep.cancel();
    if (!reducedMotion.matches && typeof light.animate === 'function') {
      sweep = light.animate([
        { transform: 'translateX(-110%)', opacity: 0 },
        { opacity: 0.85, offset: 0.4 },
        { transform: 'translateX(110%)', opacity: 0 }
      ], { duration: 650, easing: 'ease-out' });
    }
  }

  button.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') transform(true);
  });
  button.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') transform(false);
  });
  button.addEventListener('pointerdown', (event) => { lastPointer = event.pointerType; });
  button.addEventListener('click', (event) => {
    // Native button clicks with detail 0 also support Enter, Space and assistive technology.
    if (event.detail === 0 || lastPointer !== 'mouse') transform(!requested);
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') transform(false);
  });
  heroImage.addEventListener('load', () => { if (requested) transform(true); });
  heroImage.addEventListener('error', () => {
    transform(false);
    hint.textContent = '変身写真を読み込めませんでした。ページを再読み込みしてください。';
  });
})();
