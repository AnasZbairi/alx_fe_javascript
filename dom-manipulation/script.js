const quotes = [];

// Fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    // Transform server data into our quote format
    const transformedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: 'Server Category', // Default category for server quotes
    }));

    // Merge server quotes with local quotes
    mergeQuotes(transformedQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Merge server quotes with local quotes
function mergeQuotes(newQuotes) {
  newQuotes.forEach(newQuote => {
    const existingQuoteIndex = quotes.findIndex(quote => quote.text === newQuote.text);
    if (existingQuoteIndex !== -1) {
      // Replace local quote with server quote
      quotes[existingQuoteIndex] = newQuote;
    } else {
      quotes.push(newQuote); // Add new quotes to the local array
    }
  });

  saveQuotes(); // Save updated quotes to local storage
  populateCategories(); // Update the categories dropdown
  filterQuotes(); // Apply the current filter
  showNotification('Quotes updated from server!'); // Notify user
}

// Show a notification to the user
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000); // Remove notification after 3 seconds
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes.push(...JSON.parse(storedQuotes));
  }
}

// Populate the categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories

  // Clear existing options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add each category as an option
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  saveSelectedCategory(selectedCategory); // Save the selected category

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes
    .map(quote => `<p>"${quote.text}"</p><p><em>— ${quote.category}</em></p>`)
    .join('');
}

// Save the selected category to local storage
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Load the selected category from local storage
function loadSelectedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes(); // Load quotes from local storage
  populateCategories(); // Populate the categories dropdown
  const savedCategory = loadSelectedCategory(); // Load the last selected category
  document.getElementById('categoryFilter').value = savedCategory; // Set the dropdown value
  filterQuotes(); // Apply the filter
  createAddQuoteForm(); // Create the form for adding new quotes
  fetchQuotesFromServer(); // Fetch quotes from the server
  setInterval(fetchQuotesFromServer, 10000); // Fetch quotes every 10 seconds
});
