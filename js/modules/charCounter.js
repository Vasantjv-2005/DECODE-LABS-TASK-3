// js/modules/charCounter.js

export function initCharCounter() {
  const textarea = document.getElementById('char-textarea');
  const charCountEl = document.getElementById('char-count');
  const wordCountEl = document.getElementById('word-count');
  const progressFill = document.getElementById('char-progress-fill');
  
  if (!textarea || !charCountEl || !wordCountEl || !progressFill) return;

  const maxLength = 280;

  const updateCounts = () => {
    const text = textarea.value;
    const charCount = text.length;
    
    // Character text output
    charCountEl.textContent = charCount;

    // Word Count calculation
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCountEl.textContent = words;

    // SVG Circular Progress calculation
    // Dasharray is 100, so dashoffset ranges from 100 (empty) to 0 (full)
    const percentage = Math.min((charCount / maxLength) * 100, 100);
    const offset = 100 - percentage;
    progressFill.style.strokeDashoffset = offset;

    // Warning/Danger thresholds
    progressFill.classList.remove('warning', 'danger');
    if (charCount >= maxLength) {
      progressFill.classList.add('danger');
    } else if (charCount >= maxLength * 0.8) {
      progressFill.classList.add('warning');
    }
  };

  textarea.addEventListener('input', updateCounts);
  
  // Set initial states
  updateCounts();
}
