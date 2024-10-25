document.addEventListener('DOMContentLoaded', () => {

    // Fetches business data from database to display on home page
    fetch('/api/businesses')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // TODO

        })
        .catch(error => console.error('Error fetching businesses:', error));
});

const logout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include', // Include credentials if needed
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('token'); // Clear token from storage
        window.location.href = data.redirectTo; // Redirect to the home page
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Attach the logout function to a button click event
  document.getElementById('logoutButton').addEventListener('click', logout);
  