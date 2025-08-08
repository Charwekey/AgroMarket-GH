  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB2cXCTWvRb8T3jI6aRa8uzw4lt_3RvOtc",
    authDomain: "agromarket-8a437.firebaseapp.com",
    projectId: "agromarket-8a437",
    storageBucket: "agromarket-8a437.firebasestorage.app",
    messagingSenderId: "716234539577",
    appId: "1:716234539577:web:da453f9c03c48f90c403e8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);
auth.languageCode = 'en'; // Set the language code for the auth instance    
const provider = new GoogleAuthProvider();
  
const googleLoginBtn = document.querySelector('#googleLoginBtn');
googleLoginBtn.addEventListener('click', function() {
  
 signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("User signed in:", user);
    alert("Google login successful");
    window.location.href = "../pages/dashboard.html"; // Redirect to dashboard
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    alert("Error: " + errorMessage);
  });it
})
  const submit = document.querySelector('#shortbtn');
  submit.addEventListener("click", async (event) => {
event.preventDefault()

  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    alert("Login successful");
    window.location.href = "../pages/dashboard.html"; // Redirect to dashboard
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error: " + errorMessage);
    // ..
  });


});