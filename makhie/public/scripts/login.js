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