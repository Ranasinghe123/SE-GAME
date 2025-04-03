import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { 
    getAuth, 
    onAuthStateChanged,
    deleteUser,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Function to calculate total score
const calculateTotalScore = (scores) => {
    return scores ? 
        Object.values(scores).reduce((sum, score) => sum + score, 0) 
        : 0;
};

// Function to safely update element text
const safeUpdateElementText = (elementId, text) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text || "N/A";
    }
};




// Function to create falling letters background
function createFallingLetters() {
    const container = document.createElement('div');
    container.className = 'falling-letters';
    document.body.appendChild(container);
    
    // Characters to use for falling letters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    // Create initial letters
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createLetter(container, characters);
        }, i * 200);
    }
    
    // Continue creating letters
    setInterval(() => {
        createLetter(container, characters);
    }, 500);
}

// Function to create a single letter
function createLetter(container, characters) {
    // Create letter element
    const letter = document.createElement('div');
    letter.className = 'letter';
    
    // Random character
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    letter.textContent = randomChar;
    
    // Random position
    const posX = Math.random() * window.innerWidth;
    letter.style.left = `${posX}px`;
    
    // Random size
    const size = Math.random() * 14 + 12;
    letter.style.fontSize = `${size}px`;
    
    // Random opacity
    const opacity = Math.random() * 0.3 + 0.1;
    letter.style.opacity = opacity;
    
    // Random animation duration
    const duration = Math.random() * 5 + 5;
    letter.style.animationDuration = `${duration}s`;
    
    // Add to container
    container.appendChild(letter);
    
    // Remove after animation completes
    setTimeout(() => {
        letter.remove();
    }, duration * 1000);
}

// Initialize falling letters when page loads
document.addEventListener('DOMContentLoaded', function() {
    createFallingLetters();
});

// Function to get user details and rank
const fetchUserProfile = async (userId) => {
    try {
        // Fetch current user's document
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            
            // Calculate total score
            const totalScore = calculateTotalScore(userData.scores);

            // Fetch all users to determine global rank
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            
            // Calculate rank based on total score
            const userScores = [];
            usersSnapshot.forEach(doc => {
                const data = doc.data();
                const score = calculateTotalScore(data.scores);
                userScores.push({
                    id: doc.id,
                    score: score
                });
            });

            // Sort users by score in descending order
            userScores.sort((a, b) => b.score - a.score);

            // Find current user's rank
            const rank = userScores.findIndex(u => u.id === userId) + 1;

            // Safely update user details
            safeUpdateElementText("userName", userData.name);
            safeUpdateElementText("userEmail", userData.email);
            safeUpdateElementText("userRank", rank.toString());
            safeUpdateElementText("userHighscore", totalScore.toString());

            // Optional: Display level-wise scores
            const scoresContainer = document.getElementById("levelScores");
            if (scoresContainer) {
                scoresContainer.innerHTML = ""; // Clear previous scores
                
                const scoreTitle = document.createElement("h2");
                scoreTitle.textContent = "Level Scores";
                scoreTitle.style.marginTop = "20px";
                scoreTitle.style.marginBottom = "10px";
                scoresContainer.appendChild(scoreTitle);
                
                if (userData.scores && Object.keys(userData.scores).length > 0) {
                    Object.entries(userData.scores).forEach(([level, score]) => {
                        const scoreEntry = document.createElement("div");
                        scoreEntry.textContent = `Level ${level}: ${score}`;
                        scoreEntry.style.fontSize = "18px";
                        scoreEntry.style.margin = "5px 0";
                        scoresContainer.appendChild(scoreEntry);
                    });
                } else {
                    const noScores = document.createElement("div");
                    noScores.textContent = "No level scores available";
                    noScores.style.fontSize = "18px";
                    noScores.style.margin = "5px 0";
                    scoresContainer.appendChild(noScores);
                }
            }
        } else {
            console.error("User document not found");
            Swal.fire({
                title: 'Error!',
                text: 'User profile not found!',
                icon: 'error',
                confirmButtonColor: '#1E78B1'
            });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        
        // Provide more detailed error handling
        safeUpdateElementText("userName", "Error");
        safeUpdateElementText("userEmail", "Error");
        safeUpdateElementText("userRank", "Error");
        safeUpdateElementText("userHighscore", "Error");

        // Show error to user with SweetAlert2
        Swal.fire({
            title: 'Error!',
            text: `Failed to load profile: ${error.message}`,
            icon: 'error',
            confirmButtonColor: '#1E78B1'
        });
    }
};

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserProfile(user.uid);
    } else {
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to view your profile',
            icon: 'warning',
            confirmButtonColor: '#1E78B1'
        }).then(() => {
            window.location.href = "../register/register.html"; // Redirect to login page if no user is logged in
        });
    }
});

// Redirect to edit profile page
window.editProfile = function () {
    window.location.href = "change.html";
};

// Delete profile from Firebase
window.deleteProfile = async function () {
    const user = auth.currentUser;
    if (user) {
        // Use SweetAlert2 for confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! All your data will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Show loading state
                    Swal.fire({
                        title: 'Deleting...',
                        text: 'Please wait while we delete your profile',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    
                    // Delete Firestore document
                    await deleteDoc(doc(db, "users", user.uid));
                    
                    // Delete Authentication user
                    await deleteUser(user);
                    
                    // Sign out and clear local storage
                    await signOut(auth);
                    localStorage.clear();
                    
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your profile has been deleted successfully.',
                        icon: 'success',
                        confirmButtonColor: '#1E78B1'
                    }).then(() => {
                        window.location.href = "../register/register.html";
                    });
                } catch (error) {
                    console.error("Error deleting profile:", error);
                    Swal.fire({
                        title: 'Error!',
                        text: `Failed to delete profile: ${error.message}`,
                        icon: 'error',
                        confirmButtonColor: '#1E78B1'
                    });
                }
            }
        });
    }
};

