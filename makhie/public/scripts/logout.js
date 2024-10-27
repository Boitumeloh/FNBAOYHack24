// logout.js
const logoutBtn = document.querySelector('logoutBtn');

function logout() {
  localStorage.removeItem('token');
  console.log('User Logged Out')
}
  