// logout.js

const logout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET', // Adjust to POST if your route requires it
        credentials: 'include', // Include credentials if using sessions
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('token'); // Remove the token from local storage or cookies
        window.location.href = data.redirectTo; // Redirect to the home page
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Attach the logout function to a button click event (adjust the selector as needed)
  document.getElementById('logoutButton').addEventListener('click', logout);
  