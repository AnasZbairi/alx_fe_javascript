// Step 1: Simulate Server Interaction

// Mock API URL for fetching and posting quotes
const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(MOCK_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch quotes from the server');
    }
    const data = await response.json();
    // Simulate server response by mapping the data to our quote structure
    return data.map(item => ({
      text: item.title,
      category: 'Server Category' // Default category for server quotes
    }));
  } catch (error) {
    console.error('Error fetching quotes from the server:', error);
    return [];
  }
}

// Function to send quotes to the server
async function sendQuotesToServer(quotes) {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: 'POST', // Use POST to send data
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(quotes), // Convert the quotes array to JSON
    });
    if (!response.ok) {
      throw new Error('Failed to send quotes to the server');
    }
    const data = await response.json();
    console.log('Quotes sent to the server:', data);
    return data;
  } catch (error) {
    console.error('Error sending quotes to the server:', error);
    return null;
  }
}

// Step 2: Implement Data Syncing

// Function to sync local quotes with server quotes
async function syncQuotes() {
  // Fetch quotes from the server
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Merge server quotes with local quotes (server data takes precedence)
  const mergedQuotes = [...localQuotes];
  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      mergedQuotes.push(serverQuote);
    }
  });

  // Save merged quotes to localStorage
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes; // Update the global quotes array

  // Send the updated quotes to the server
  await sendQuotesToServer(mergedQuotes);

  // Notify the user of the sync with the exact message
  showNotification('Quotes synced with server!');
  populateCategories(); // Update the categories dropdown
  filterQuotes(); // Refresh the displayed quotes
}

// Step 3: Handling Conflicts

// Function to show a notification to the user
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

  // Remove the notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Step 4: Initialize the Application

// Initialize the quotes array with some default quotes or load from localStorage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" }
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p><em>— ${randomQuote.category}</em></p>`;
}

// Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes(); // Save quotes to localStorage
    populateCategories(); // Update the categories dropdown
    filterQuotes(); // Refresh the displayed quotes
  } else {
    alert('Please fill in both the quote and category fields.');
  }
}

// Function to populate the categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category from localStorage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `
    <p>"${quote.text}"</p><p><em>— ${quote.category}</em></p>
  `).join('');

  // Save the selected category to localStorage
  localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Step 5: Add Event Listeners and Initialize

// Add event listener for the category filter dropdown
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Add event listener for the sync button
document.getElementById('syncQuotes').addEventListener('click', syncQuotes);

// Display a random quote when the page loads
showRandomQuote();

// Create the "Add Quote" form dynamically
createAddQuoteForm();

// Populate the categories dropdown when the page loads
populateCategories();

// Filter quotes based on the last selected category when the page loads
filterQuotes();

// Periodically sync quotes with the server (every 30 seconds)
setInterval(syncQuotes, 30000);
