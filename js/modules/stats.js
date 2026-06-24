// js/modules/stats.js

export function initStats() {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (!statsSection || statNumbers.length === 0) return;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1500; // 1.5 seconds
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Calculate current value based on progress and target
      const value = Math.floor(progress * target);
      element.textContent = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  // Intersection Observer to trigger when visible
  const observerOptions = {
    root: null, // viewport
    threshold: 0.15 // trigger when 15% is visible
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger count up for all stat numbers
        statNumbers.forEach(num => countUp(num));
        
        // Stop observing once triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statsObserver.observe(statsSection);
}
