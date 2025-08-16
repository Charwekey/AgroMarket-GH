
    // Simulate getting name & role from localStorage
    const userName = localStorage.getItem('userName') || "Guest";
    const userRole = localStorage.getItem('userRole') || "buyer";
    const firstTime = localStorage.getItem('firstTime') === "true";

    const welcomeDiv = document.getElementById("welcome-message");

    // Customize message
    let message = firstTime 
        ? `Welcome to AgroMarket Gh! 🎉` 
        : `Welcome back to AgroMarket Gh !`;

    welcomeDiv.textContent = message;

    // Add animation after small delay
    setTimeout(() => {
      welcomeDiv.classList.add("slide-in");
      welcomeDiv.style.opacity = "1";
    }, 300);
  