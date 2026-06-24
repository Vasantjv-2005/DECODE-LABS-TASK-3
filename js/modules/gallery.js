// js/modules/gallery.js

export function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');

  if (galleryCards.length === 0) return;

  // 1. Gallery Filtering Logic with smooth animations
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch = filterValue === 'all' || cardCategory === filterValue;

        if (isMatch) {
          card.style.display = 'block';
          // Force layout recalculation for transition
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          // Hide from layout after fading out
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300); // matches CSS transitions
        }
      });
    });
  });

  // 2. Lightbox Modal logic
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-card-img');
      const title = card.querySelector('.gallery-card-title').textContent;
      const tag = card.querySelector('.gallery-card-tag').textContent;

      if (!img || !lightbox || !lightboxImg) return;

      // Set image content and captions
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxTag) lightboxTag.textContent = tag;

      // Open modal
      lightbox.classList.add('open');
    });
  });

  // Close Lightbox handler
  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      // Clear image source after transition to prevent flashes next time
      setTimeout(() => {
        if (!lightbox.classList.contains('open')) {
          lightboxImg.src = '';
        }
      }, 350);
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}
