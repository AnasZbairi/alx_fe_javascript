// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch quotes from the server');
        }

        const data = await response.json();
        console.log('Quotes fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Function to send quotes to the server
async function sendQuotesToServer(quotes) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(quotes), // Convert the data to JSON format
        });

        if (!response.ok) {
            throw new Error('Failed to send quotes to the server');
        }

        const result = await response.json();
        console.log('Quotes sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending quotes:', error);
    }
}

// Function to sync quotes between local storage and server
async function syncQuotes() {
    // Fetch quotes from the server
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes) {
        // Get local quotes from localStorage
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Merge local and server quotes (simple conflict resolution: server takes precedence)
        const mergedQuotes = resolveConflicts(localQuotes, serverQuotes);

        // Save merged quotes to localStorage
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
        console.log('Quotes synced successfully:', mergedQuotes);

        // Send the merged quotes back to the server
        await sendQuotesToServer(mergedQuotes);

        // Notify the user
        alert('Quotes have been synced with the server.');
    }
}

// Function to resolve conflicts between local and server quotes
function resolveConflicts(localQuotes, serverQuotes) {
    // Simple conflict resolution: server quotes take precedence
    return serverQuotes;
}

// Function to check for conflicts and resolve them
async function checkForConflicts() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = await fetchQuotesFromServer();

    if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
        console.log('Conflict detected. Resolving...');
        const resolvedQuotes = resolveConflicts(localQuotes, serverQuotes);
        localStorage.setItem('quotes', JSON.stringify(resolvedQuotes));
        alert('Quotes have been updated from the server.');
    } else {
        console.log('No conflicts detected.');
    }
}

// Periodically sync quotes (e.g., every 5 minutes)
setInterval(syncQuotes, 5 * 60 * 1000);

// Periodically check for conflicts (e.g., every 2 minutes)
setInterval(checkForConflicts, 2 * 60 * 1000);

// Example usage: Fetch and sync quotes on page load
window.addEventListener('load', async () => {
    await syncQuotes();
    await checkForConflicts();
});
