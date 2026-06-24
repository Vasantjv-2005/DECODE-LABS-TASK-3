// js/modules/quoteGenerator.js

const quotes = [
  { text: "Make it simple, but significant.", author: "Don Draper" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "Details are not the details. They make the design.", author: "Charles Eames" },
  { text: "Good design is as little design as possible.", author: "Dieter Rams" },
  { text: "Digital design is like painting, except the paint is never dry.", author: "Neville Brody" },
  { text: "Simplicity is about subtracting the obvious and adding the meaningful.", author: "John Maeda" },
  { text: "A user interface is like a joke. If you have to explain it, it’s not that good.", author: "Martin Leblanc" }
];

export function initQuoteGenerator() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const generateBtn = document.getElementById('quote-generate-btn');

  if (!quoteText || !quoteAuthor || !generateBtn) return;

  let currentIdx = -1;

  const getNewQuote = () => {
    // Prevent getting the same quote twice in a row
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * quotes.length);
    } while (newIdx === currentIdx);
    
    currentIdx = newIdx;
    const quote = quotes[currentIdx];

    // Transition effect
    quoteText.classList.add('fade');
    quoteAuthor.classList.add('fade');

    // Swap text once faded out, then fade in
    setTimeout(() => {
      quoteText.textContent = `“${quote.text}”`;
      quoteAuthor.textContent = `— ${quote.author}`;
      quoteText.classList.remove('fade');
      quoteAuthor.classList.remove('fade');
    }, 250); // Matches the CSS transition length
  };

  generateBtn.addEventListener('click', getNewQuote);
  
  // Set initial quote
  getNewQuote();
}
