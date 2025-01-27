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

// Function to simulate sending data to the server
async function sendDataToServer(data) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(data), // Convert the data to JSON format
        });

        if (!response.ok) {
            throw new Error('Failed to send data to the server');
        }

        const result = await response.json();
        console.log('Data sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

// Function to sync local data with server data
async function syncData() {
    const serverData = await fetchQuotesFromServer(); // Use fetchQuotesFromServer here
    if (serverData) {
        // Update local storage with server data
        localStorage.setItem('quotes', JSON.stringify(serverData));
        console.log('Local data synced with server data');
    }
}

// Function to resolve conflicts
function resolveConflicts(localData, serverData) {
    // Simple conflict resolution: server data takes precedence
    return serverData;
}

// Function to check for conflicts and resolve them
async function checkForConflicts() {
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverData = await fetchQuotesFromServer(); // Use fetchQuotesFromServer here

    if (JSON.stringify(localData) !== JSON.stringify(serverData)) {
        console.log('Conflict detected. Resolving...');
        const resolvedData = resolveConflicts(localData, serverData);
        localStorage.setItem('quotes', JSON.stringify(resolvedData));
        alert('Data has been updated from the server.');
    } else {
        console.log('No conflicts detected.');
    }
}

// Periodically sync data (e.g., every 5 minutes)
setInterval(syncData, 5 * 60 * 1000);

// Periodically check for conflicts (e.g., every 2 minutes)
setInterval(checkForConflicts, 2 * 60 * 1000);

// Example usage: Send data to the server
const exampleData = { quote: "This is a test quote", author: "Anonymous" };
sendDataToServer(exampleData);

// Example usage: Fetch and sync data on page load
window.addEventListener('load', async () => {
    await syncData();
    await checkForConflicts();
});
