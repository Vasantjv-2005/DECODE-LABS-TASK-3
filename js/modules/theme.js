// js/modules/theme.js
import state from '../state.js';

export function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const navToggleBtn = document.getElementById('nav-theme-toggle-btn');
  const accentButtons = document.querySelectorAll('.theme-opt-btn');

  // 1. Subscribe to Dark/Light Theme state
  state.subscribe('theme', (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    // Update floating indicator and other switches if they exist
    const themeIcon = document.querySelector('#floating-theme-btn svg');
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      } else {
        themeIcon.innerHTML = '<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    }
  });

  // Toggle Theme handler
  const handleToggle = () => {
    const currentTheme = state.get('theme');
    state.set('theme', currentTheme === 'dark' ? 'light' : 'dark');
  };

  if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
  if (navToggleBtn) navToggleBtn.addEventListener('click', handleToggle);

  // 2. Subscribe to Accent Color state
  state.subscribe('accent', (accent) => {
    // Clear all accent classes from body
    document.body.classList.remove('theme-blue', 'theme-violet', 'theme-cyan');
    // Add current accent class
    document.body.classList.add(`theme-${accent}`);

    // Update active state of selector buttons
    accentButtons.forEach(btn => {
      if (btn.classList.contains(`opt-${accent}`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update custom cursor color dynamic references
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    if (cursor && cursorDot) {
      let color = '#8b5cf6'; // default violet
      if (accent === 'blue') color = '#3b82f6';
      if (accent === 'cyan') color = '#06b6d4';
      cursor.style.borderColor = color;
      cursorDot.style.backgroundColor = color;
    }
  });

  // Accent Switch clicks
  accentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('opt-blue')) state.set('accent', 'blue');
      if (btn.classList.contains('opt-violet')) state.set('accent', 'violet');
      if (btn.classList.contains('opt-cyan')) state.set('accent', 'cyan');
    });
  });
}
