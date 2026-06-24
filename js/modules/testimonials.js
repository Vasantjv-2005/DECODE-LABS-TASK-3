// js/modules/testimonials.js

export function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (!track || slides.length === 0) return;

  const slidesCount = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  const autoPlayDelay = 6000; // 6 seconds

  // 1. Create dynamic pagination dots based on slide counts
  dotsContainer.innerHTML = ''; // Clear fallback dots
  for (let i = 0; i < slidesCount; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  }

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  // 2. Main Slide Navigation
  const goToSlide = (index) => {
    currentIndex = index;
    // Slide left/right by index offset
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active dot classes
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % slidesCount);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + slidesCount) % slidesCount);
  };

  // Wire up Arrow Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  // 3. Autoplay Loop Implementation
  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Stop auto-sliding on card focus or hovering (UX best practice)
  const sliderArea = document.querySelector('.testimonials-slider');
  if (sliderArea) {
    sliderArea.addEventListener('mouseenter', stopAutoPlay);
    sliderArea.addEventListener('mouseleave', startAutoPlay);
  }

  // Kickstart autoplay
  startAutoPlay();
}
