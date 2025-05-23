// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJHzjy-B8F133WC2Bp3P3LU9UP5mZFSpE",
    authDomain: "se-game-dc697.firebaseapp.com",
    projectId: "se-game-dc697",
    storageBucket: "se-game-dc697.firebasestorage.app",
    messagingSenderId: "469363039216",
    appId: "1:469363039216:web:2eea4a87692aa0857a5b35",
    measurementId: "G-5S3RFQWND0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Pre-fill form with current user details
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');

            // Show loading animation while fetching user data
            Swal.fire({
                title: 'Loading profile...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Fetch user document
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    Swal.close(); // Close loading animation
                    
                    if (doc.exists) {
                        const userData = doc.data();
                        nameInput.value = userData.name || user.displayName || '';
                        emailInput.value = userData.email || user.email || '';
                    }
                })
                .catch((error) => {
                    console.error('Error getting user document:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to load profile data: ' + error.message
                    });
                });

            // Profile form submission
            const profileForm = document.getElementById('profileForm');
            profileForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const newName = nameInput.value.trim();
                const newEmail = emailInput.value.trim();

                if (!newName || !newEmail) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Please fill in all fields!'
                    });
                    return;
                }

                // Show loading animation during update
                Swal.fire({
                    title: 'Updating profile...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Update profile
                user.updateProfile({
                    displayName: newName
                }).then(() => {
                    // Update email
                    user.updateEmail(newEmail).then(() => {
                        // Update Firestore document
                        db.collection('users').doc(user.uid).update({
                            name: newName,
                            email: newEmail
                        }).then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success!',
                                text: 'Profile updated successfully!',
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = 'profile.html';
                            });
                        }).catch((error) => {
                            console.error('Firestore update error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Update Failed',
                                text: 'Failed to update Firestore: ' + error.message
                            });
                        });
                    }).catch((error) => {
                        console.error('Email update error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Email Update Failed',
                            text: 'Failed to update email: ' + error.message,
                            footer: 'You may need to re-authenticate before changing email'
                        });
                    });
                }).catch((error) => {
                    console.error('Profile update error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Profile Update Failed',
                        text: 'Failed to update profile: ' + error.message
                    });
                });
            });
        } else {
            // No user is signed in, redirect to login
            window.location.href = 'login.html';
        }
    });
});



// Function to create falling letters
function createFallingLetters() {
    const fallingBg = document.getElementById('fallingBg');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const lettersCount = 150;
    
    for (let i = 0; i < lettersCount; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        
        // Random letter
        letter.innerText = letters.charAt(Math.floor(Math.random() * letters.length));
        
        // Random position
        letter.style.left = Math.random() * 100 + 'vw';
        
        // Random size
        const size = Math.random() * 20 + 10;
        letter.style.fontSize = size + 'px';
        
        // Random opacity
        letter.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Random fall duration
        const duration = Math.random() * 15 + 5;
        letter.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        letter.style.animationDelay = delay + 's';
        
        // Add to background
        fallingBg.appendChild(letter);
    }
}

// Create falling letters on page load
window.addEventListener('load', createFallingLetters);

// Profile functions (placeholder)
function cancelProfile() {
    // Add your cancel functionality here
    window.history.back();
}

// Form submission handler
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    
    // Example success notification
    Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonColor: '#1E78B1'
    });
});

// Cancel profile editing with confirmation
function cancelProfile() {
    Swal.fire({
        title: 'Discard Changes?',
        text: "Any unsaved changes will be lost!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, discard!',
        cancelButtonText: 'No, keep editing'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'profile.html';
        }
    });
}

// Expose to global scope
window.cancelProfile = cancelProfile;