// Array of quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>${randomQuote.category}</em></p>`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        displayRandomQuote();
    } else {
        alert('Please fill in both fields.');
    }
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Display a random quote when the page loads
window.onload = displayRandomQuote;
