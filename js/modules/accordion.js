// js/modules/accordion.js

export function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const panel = item.querySelector('.faq-panel');

    if (!header || !panel) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // 1. Close all other FAQ panels (single accordion mode)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) {
            otherPanel.style.maxHeight = '0';
          }
        }
      });

      // 2. Toggle current panel
      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Handle window resize: recalculate heights of open items
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('open')) {
        const panel = item.querySelector('.faq-panel');
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });
}
