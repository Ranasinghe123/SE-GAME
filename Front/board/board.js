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
const db = firebase.firestore();

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

async function loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = ""; // Clear existing entries

    try {
        // Fetch all users
        const usersSnapshot = await db.collection('users').get();
        
        // Calculate total scores for each user
        const userScores = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const totalScore = userData.scores ? 
                Object.values(userData.scores).reduce((sum, score) => sum + score, 0) 
                : 0;
            
            // Only add users with scores
            if (totalScore > 0) {
                userScores.push({
                    name: userData.name || 'Anonymous', // Use name if available
                    totalScore: totalScore
                });
            }
        });

        // Sort users by total score in descending order
        userScores.sort((a, b) => b.totalScore - a.totalScore);

        // Add ranked entries to leaderboard
        userScores.forEach((user, index) => {
            const entry = document.createElement("div");
            entry.classList.add("entry");
            entry.innerHTML = `
                <span class="rank">${index + 1}</span> 
                <span class="name">${user.name}</span> 
                <span class="score">${user.totalScore}</span>
            `;
            leaderboardList.appendChild(entry);
        });
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardList.innerHTML = "<div class='entry'>Error loading leaderboard</div>";
    }
}

// Initialize page
window.onload = function() {
    // Create falling letters animation
    createFallingLetters();
    
    // Load leaderboard data
    loadLeaderboard();
};