// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Handle Registration Form Submission
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        if (!name || !email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please fill in all fields.',
                confirmButtonColor: '#4285f4'
            });
            return;
        }

        // Show loading state
        Swal.fire({
            title: 'Creating your account',
            html: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            // Show success message and redirect
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Your account has been created.',
                confirmButtonColor: '#4285f4',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../login/login.html"; // Redirect to login page
            });
        } catch (error) {
            console.error("Registration Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message,
                confirmButtonColor: '#4285f4'
            });
        }
    });

    // Google Registration
    document.getElementById("googleRegister").addEventListener("click", async function () {
        try {
            // Show loading state
            Swal.fire({
                title: 'Connecting to Google',
                html: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save Google user details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                createdAt: new Date().toISOString()
            });

            // Show success message and redirect
            Swal.fire({
                icon: 'success',
                title: 'Google Registration Successful!',
                text: 'Your account has been created.',
                confirmButtonColor: '#4285f4',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../login/login.html"; // Redirect to login page
            });
        } catch (error) {
            console.error("Google Registration Error:", error);
            
            // Check if error is from user cancelling the popup
            if (error.code === 'auth/popup-closed-by-user') {
                Swal.fire({
                    icon: 'info',
                    title: 'Sign-in Cancelled',
                    text: 'You cancelled the Google sign-in process.',
                    confirmButtonColor: '#4285f4'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Google Registration Failed',
                    text: error.message,
                    confirmButtonColor: '#4285f4'
                });
            }
        }
    });
});