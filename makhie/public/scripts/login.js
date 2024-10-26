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
            localStorage.setItem('token', data.token);

            // Hide message and redirect to dashboard after delay
            setTimeout(() => {
                flashMessage.className = 'flash-message hide';
                setTimeout(() => { window.location.href = '/dashboard'; }, 500);
            }, 2000);
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
