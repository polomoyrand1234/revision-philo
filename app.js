(function () {
  // ========== Helper: lightbox ==========
  function createLightbox() {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lightbox__overlay" data-lb-close></div>
      <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Agrandissement">
        <button class="lightbox__close" type="button" data-lb-close aria-label="Fermer">✕</button>
        <img class="lightbox__img" alt="" />
        <div class="lightbox__cap"></div>
      </div>
    `;
    document.body.appendChild(lb);
    return lb;
  }

  function injectLightboxCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .lightbox{ position:fixed; inset:0; display:none; z-index:9999; }
      .lightbox.open{ display:block; }
      .lightbox__overlay{ position:absolute; inset:0; background:rgba(0,0,0,.72); }
      .lightbox__panel{
        position:relative;
        max-width: 980px;
        margin: 6vh auto 0;
        padding: 14px;
        border-radius: 18px;
        background: rgba(15,18,28,.92);
        border: 1px solid rgba(255,255,255,.14);
        box-shadow: 0 24px 70px rgba(0,0,0,.45);
        width: calc(100% - 24px);
      }
      .lightbox__close{
        position:absolute; top:10px; right:10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.08);
        color: rgba(255,255,255,.9);
        padding: 8px 10px;
        cursor:pointer;
      }
      .lightbox__close:hover{ background: rgba(255,255,255,.12); }
      .lightbox__img{
        width:100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 14px;
        display:block;
        background: rgba(0,0,0,.25);
      }
      .lightbox__cap{
        margin-top: 10px;
        color: rgba(255,255,255,.75);
        font-size: .95rem;
        padding: 0 4px 4px;
      }
    `;
    document.head.appendChild(style);
  }

  injectLightboxCSS();
  const lightbox = createLightbox();
  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCap = lightbox.querySelector('.lightbox__cap');

  function openLightbox(src, caption, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCap.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  lightbox.querySelectorAll('[data-lb-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ========== Gallery: handle broken images + click to zoom ==========
  const imgs = document.querySelectorAll('.gallery img');

  imgs.forEach((img) => {
    // If image missing => replace with placeholder
    img.addEventListener('error', () => {
      img.removeAttribute('src');
      img.classList.add('img-missing');

      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      ph.innerHTML = `
        <div class="img-placeholder__icon">🖼️</div>
        <div class="img-placeholder__txt">Image manquante</div>
        <div class="img-placeholder__hint">Ajoute le fichier dans assets/…</div>
      `;

      const parent = img.parentElement;
      img.style.display = 'none';
      parent.insertBefore(ph, img);
    });

    // Zoom on click
    img.addEventListener('click', () => {
      const figure = img.closest('figure');
      const cap = figure ? figure.querySelector('figcaption')?.textContent : '';
      openLightbox(img.getAttribute('src'), cap, img.getAttribute('alt'));
    });

    // Make focusable for keyboard
    img.tabIndex = 0;
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        img.click();
      }
    });
  });

  // ========== Placeholder CSS ==========
  const phStyle = document.createElement('style');
  phStyle.textContent = `
    .img-placeholder{
      height: 190px;
      display:flex;
      flex-direction: column;
      align-items:center;
      justify-content:center;
      gap: 6px;
      padding: 10px;
      color: rgba(255,255,255,.72);
      background: rgba(0,0,0,.28);
      border-radius: 0;
    }
    .img-placeholder__icon{ font-size: 1.3rem; }
    .img-placeholder__txt{ font-weight: 650; }
    .img-placeholder__hint{ color: rgba(255,255,255,.55); font-size: .9rem; text-align:center; }
    .gallery img{ cursor: zoom-in; }
    .gallery img:focus{ outline:none; box-shadow: 0 0 0 4px rgba(120,160,255,.35); border-radius: 14px; }
  `;
  document.head.appendChild(phStyle);

})();
