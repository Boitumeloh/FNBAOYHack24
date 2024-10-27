// Ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('authLink');

    if (token) {
        // Show logout link if token exists
        authLink.innerHTML = '<a id="logoutBtn" href="#">Logout</a>';
        
        // Add click event listener to logout button
        document.getElementById('logoutBtn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('token'); // Remove token from localStorage
            window.location.href = '/login'; // Redirect to login page
        });
    } else {
        // Show login link if no token exists
        authLink.innerHTML = '<a href="/login">Login</a>';
    }
});