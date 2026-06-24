// js/modules/floatingPanel.js
import state from '../state.js';

export function initFloatingPanel() {
  const panel = document.getElementById('floating-panel');
  const scrollBtn = document.getElementById('floating-scroll-btn');
  const themeBtn = document.getElementById('floating-theme-btn');
  const ringFill = document.getElementById('scroll-ring-fill');

  if (!panel || !scrollBtn || !themeBtn || !ringFill) return;

  // 1. Scroll-depth tracking & display panel logic
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate scroll percentage
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    // Update SVG progress ring
    // Dasharray is 100, dashoffset is 100 (empty) to 0 (full)
    const offset = 100 - scrollPercent;
    ringFill.style.strokeDashoffset = offset;

    // Show/hide floating actions panel
    if (scrollTop > 300) {
      panel.classList.add('visible');
    } else {
      panel.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll);
  
  // Set initial scroll calculations
  handleScroll();

  // 2. Scroll to top handler
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 3. Quick theme toggle inside floating panel
  themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTheme = state.get('theme');
    state.set('theme', currentTheme === 'dark' ? 'light' : 'dark');
  });
}
