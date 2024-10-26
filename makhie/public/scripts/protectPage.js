//Redirect to login page if no token is found
if (!localStorage.getItem('token')) {
    window.location.href = '/login';
}
