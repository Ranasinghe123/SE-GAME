// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJHzjy-B8F133WC2Bp3P3LU9UP5mZFSpE",
    authDomain: "se-game-dc697.firebaseapp.com",
    projectId: "se-game-dc697",
    storageBucket: "se-game-dc697.appspot.com",
    messagingSenderId: "469363039216",
    appId: "1:469363039216:web:2eea4a87692aa0857a5b35",
    measurementId: "G-5S3RFQWND0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to store JWT token in cookies
function setAuthCookie(token) {
    document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
    console.log("✅ JWT Token stored in cookie:", token);
    console.log("✅ Cookies after setting:", document.cookie);
}

// Function to get JWT token from cookies
function getAuthToken() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "authToken") {
            console.log("✅ Found JWT Token in cookies:", value);
            return value;
        }
    }
    console.log("❌ No JWT Token found in cookies.");
    return null;
}

// Function to handle login
document.addEventListener("DOMContentLoaded", function () {
    console.log("📢 Checking authentication on page load...");
    console.log("✅ Current Cookies:", document.cookie);

    const form = document.getElementById("loginform");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent form default submission

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Please enter both email and password.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Show loading indicator
            Swal.fire({
                title: 'Logging in...',
                html: 'Please wait while we verify your credentials',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Get Firebase JWT Token
                const token = await user.getIdToken();

                // Store token in cookie
                setAuthCookie(token);

                console.log("✅ Login successful for:", user.email);
                console.log("✅ User Session Info:", user);
                console.log("✅ JWT Token from Firebase:", token);

                // Close loading indicator and show success message
                Swal.fire({
                    title: 'Success!',
                    text: `Welcome, ${user.email}`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Redirect to main.html
                    window.location.href = "../main/main.html";
                });

            } catch (error) {
                console.error("❌ Login Error:", error.message);
                
                Swal.fire({
                    title: 'Login Failed',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
            }
        });
    } else {
        console.warn("⚠️ Login form not found. Make sure login.html has an element with id='loginform'.");
    }
});

// Google Login Function
window.googleLogin = async function () {
    try {
        // Show loading indicator
        Swal.fire({
            title: 'Connecting to Google...',
            html: 'Please wait while we connect to your Google account',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get Firebase JWT Token
        const token = await user.getIdToken();

        // Store token in cookie
        setAuthCookie(token);

        console.log("✅ Google Login successful for:", user.displayName);
        console.log("✅ User Session Info:", user);
        console.log("✅ JWT Token from Firebase:", token);

        // Close loading indicator and show success message
        Swal.fire({
            title: 'Success!',
            text: `Welcome, ${user.displayName}`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // Redirect to main.html
            window.location.href = "../main/main.html";
        });

    } catch (error) {
        console.error("❌ Google Login Error:", error.message);
        
        Swal.fire({
            title: 'Google Login Failed',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
};

// Function to check if the user is logged in and redirect if necessary
document.addEventListener("DOMContentLoaded", async function () {
    // Check if we're on the login page
    const isLoginPage = window.location.pathname.includes("login.html");
    const authToken = getAuthToken();

    if (!authToken && !isLoginPage) {
        console.log("❌ No valid session found. Redirecting to login page...");
        
        Swal.fire({
            title: 'Session Expired',
            text: 'Please log in again to continue',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../login/login.html";
        });
    } else if (authToken && isLoginPage) {
        // If we're already logged in and on the login page, redirect to main
        console.log("✅ User is already authenticated. Redirecting to main page...");
        
        Swal.fire({
            title: 'Already Logged In',
            text: 'Redirecting to the main page',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../main/main.html";
        });
    } else {
        console.log("✅ Authentication state is appropriate for current page.");
    }
});

// Logout function
window.logout = function () {
    Swal.fire({
        title: 'Log Out?',
        text: 'Are you sure you want to log out?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            
            console.log("✅ User logged out. JWT token cleared from cookies.");
            
            Swal.fire({
                title: 'Logged Out',
                text: 'You have been successfully logged out',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../login/login.html";
            });
        }
    });
};