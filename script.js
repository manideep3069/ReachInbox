document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Mock login logic, replace with your actual API call
  if (email === "test@example.com" && password === "password") {
    alert("Login successful!");
    window.location.href = '/google-login'; // Redirect to onebox screen
  } else {
    alert("Login failed. Please check your credentials.");
  }
});
