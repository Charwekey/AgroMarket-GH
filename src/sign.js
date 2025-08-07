 function showSection(id) {
      document.getElementById('home').style.display = 'none';
      document.getElementById('auth-section').style.display = 'flex';
    }

    function switchForm(type) {
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      const switchText = document.getElementById('switchText');

      if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        switchText.innerHTML = "Don't have an account? <a href=\"#\" onclick=\"switchForm('register')\">Register here</a>";
      } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchText.innerHTML = "Already have an account? <a href=\"#\" onclick=\"switchForm('login')\">Login here</a>";
      }
    }