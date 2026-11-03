(() => {
  const galleries = [...document.querySelectorAll('.project-gallery')];
  function fit(gallery) {
    const slides = JSON.parse(gallery.dataset.slides);
    const slide = slides[Number(gallery.dataset.index)];
    const width = Math.min(1100, window.innerWidth - (window.innerWidth < 620 ? 28 : 120), Math.max(220, window.innerHeight - 202) * slide.width / slide.height);
    gallery.closest('.case-viewer').style.setProperty('--viewer-width', `${Math.round(width + 12)}px`);
  }
  function show(gallery, index) {
    const slides = JSON.parse(gallery.dataset.slides);
    index = (index + slides.length) % slides.length;
    gallery.dataset.index = String(index);
    const slide = slides[index];
    const image = gallery.querySelector('.gallery-image');
    image.src = slide.src;
    image.width = slide.width;
    image.height = slide.height;
    image.alt = `${gallery.closest('dialog').querySelector('h2').textContent} — ${slide.label}`;
    gallery.querySelector('.gallery-position b').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    gallery.querySelector('.gallery-position span').textContent = slide.label;
    gallery.querySelector('.gallery-original').href = slide.src;
    fit(gallery);
  }
  galleries.forEach(gallery => {
    const slides = JSON.parse(gallery.dataset.slides);
    const modal = gallery.closest('dialog');
    gallery.querySelectorAll('[data-gallery-step]').forEach(button => {
      button.disabled = slides.length < 2;
      button.addEventListener('click', () => show(gallery, Number(gallery.dataset.index) + Number(button.dataset.galleryStep)));
    });
    modal.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      show(gallery, Number(gallery.dataset.index) + (event.key === 'ArrowRight' ? 1 : -1));
    });
    let start = null;
    const frame = gallery.querySelector('.gallery-frame');
    frame.addEventListener('pointerdown', event => { start = {x:event.clientX, y:event.clientY}; });
    frame.addEventListener('pointerup', event => {
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(gallery, Number(gallery.dataset.index) + (dx < 0 ? 1 : -1));
    });
    frame.addEventListener('pointercancel', () => { start = null; });
    new MutationObserver(() => {
      if (modal.open) {
        modal.querySelector('.case-description').open = false;
        show(gallery, 0);
      }
    }).observe(modal, {attributes:true, attributeFilter:['open']});
    fit(gallery);
  });
  window.addEventListener('resize', () => galleries.forEach(fit));
})();
