
    // Simulate getting name & role from localStorage
    const userName = localStorage.getItem('userName') || "Guest";
    const userRole = localStorage.getItem('userRole') || "buyer";
    const firstTime = localStorage.getItem('firstTime') === "true";

    const welcomeDiv = document.getElementById("welcome-message");

    // Customize message
    let message = firstTime 
        ? `Welcome, ${userName} (${userRole})! 🎉` 
        : `Welcome back to AgroMarket Gh ${userName} (${userRole})!`;

    welcomeDiv.textContent = message;

    // Add animation after small delay
    setTimeout(() => {
      welcomeDiv.classList.add("slide-in");
      welcomeDiv.style.opacity = "1";
    }, 300);
  