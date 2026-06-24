// js/modules/counter.js

export function initCounter() {
  const counterVal = document.getElementById('counter-value');
  const btnInc = document.getElementById('counter-inc');
  const btnDec = document.getElementById('counter-dec');
  const btnReset = document.getElementById('counter-reset');

  if (!counterVal) return;

  let count = 0;

  const updateCounter = (newValue) => {
    count = newValue;
    counterVal.textContent = count;
    
    // Trigger scale-bump animation
    counterVal.classList.remove('bump');
    void counterVal.offsetWidth; // Force reflow
    counterVal.classList.add('bump');
  };

  // Remove animation class after playing
  counterVal.addEventListener('animationend', () => {
    counterVal.classList.remove('bump');
  });

  btnInc.addEventListener('click', () => updateCounter(count + 1));
  btnDec.addEventListener('click', () => updateCounter(count - 1));
  btnReset.addEventListener('click', () => updateCounter(0));
}
