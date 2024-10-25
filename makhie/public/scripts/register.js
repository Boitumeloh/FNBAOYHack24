// Event listener for form submission
document.getElementById('dataForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Gather form data
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Create user object
  const userData = {
    username: username,
    email: email,
    password: password
  };

  try {
    // Send a POST request to the registration API endpoint
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Handle the response
    const data = await response.json();
    if (response.ok) {
      // Registration successful
      alert('Registration successful! Welcome, ' + data.username);
      window.location.href = '/login'; // Redirect to the login page
    } else {
      // Registration failed
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Registration failed. Please try again later.');
  }
});