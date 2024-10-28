document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const flashMessage = document.getElementById('flashMessage');

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login success message
            flashMessage.textContent = `Login successful! Welcome back, ${data.username}`;
            flashMessage.className = 'flash-message show';

            // Store the token in localStorage and confirm its storage
            localStorage.setItem('token', data.token);
            console.log('Token stored in localStorage:', localStorage.getItem('token'));

            // Redirect immediately to avoid timing issues
            window.location.href = '/dashboard';
        } else {
            // Login failed message
            flashMessage.textContent = `Error: ${data.message}`;
            flashMessage.className = 'flash-message show';

            // Hide message after delay
            setTimeout(() => { flashMessage.className = 'flash-message hide'; }, 2000);
        }
    } catch (error) {
        console.error('Error during login:', error);
        flashMessage.textContent = 'Error occurred while logging in. Please try again later.';
        flashMessage.className = 'flash-message show';

        setTimeout(() => { flashMessage.className = 'flash-message hide'; }, 2000);
    }
});

// Function to attach token to requests
async function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
        // Attach token to Authorization header if it exists
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`, // Ensure the Bearer prefix is included
        };
        console.log('Authorization header attached:', options.headers['Authorization']); // Confirm header
    } else {
        console.warn('Token not found in localStorage'); // Log if token is missing
    }
    return fetch(url, options); // Make the fetch call
}

// Function to check if user is authenticated before accessing protected routes
async function checkAuthentication() {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
        // Redirect to login if token does not exist
        window.location.href = '/login';
    } else {
        // Optionally, verify token validity by making a request to a protected route
        const response = await fetchWithToken('/api/protected-data', { method: 'GET' });
        if (!response.ok) {
            console.log('Token invalid, redirecting to login');
            window.location.href = '/login';
        } else {
            console.log('Token valid, user is authenticated');
        }
    }
}

// Call checkAuthentication when the page loads for protected routes
window.onload = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/home' || currentPath === '/dashboard') {
        checkAuthentication(); // Check authentication when accessing protected routes
    }
};
