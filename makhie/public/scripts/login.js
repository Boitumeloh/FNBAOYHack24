document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/invest_dashboard.html';
        } else {
            document.getElementById('message').innerText = 'Login failed';
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Error occurred while logging in';
    }
});

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create user object
    const userData = {
      email: email,
      password: password
    };

    try {
      // Send a POST request to the login API endpoint
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Handle the response
      const data = await response.json();
      if (response.ok) {
        // Login successful
        alert('Login successful! Welcome back, ' + data.username);
        // Store token in local storage (if applicable)
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard'; // Redirect to the dashboard page
      } else {
        // Login failed
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again later.');
    }
  });