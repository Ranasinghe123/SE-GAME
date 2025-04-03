// Function to get JWT token from cookies
function getAuthToken() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "authToken") {
            return value;
        }
    }
    return null;
}

// Falling letters background
function createFallingLetters() {
    const fallingBg = document.getElementById('falling-bg');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numLetters = 100; // Number of letters on screen
    
    for (let i = 0; i < numLetters; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        
        // Random letter from alphabet
        letter.innerText = letters.charAt(Math.floor(Math.random() * letters.length));
        
        // Random position and size
        const size = Math.floor(Math.random() * 30) + 16; // 16-46px
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 30; // 0-30s delay
        const duration = Math.random() * 15 + 10; // 10-25s to fall
        const opacity = Math.random() * 0.4 + 0.1; // 0.1-0.5 opacity
        
        letter.style.fontSize = `${size}px`;
        letter.style.left = `${left}%`;
        letter.style.top = `-${size}px`;
        letter.style.opacity = opacity;
        letter.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        fallingBg.appendChild(letter);
    }
}

// Add button hover sound effects
function addButtonSoundEffects() {
    const buttons = document.querySelectorAll('.btn-animated');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // You can add a soft hover sound here if desired
            button.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        button.addEventListener('click', () => {
            // Add click animation
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });
}

// Button interaction animation
function setupButtonInteractions() {
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('.btn-animated');
    
    // Add subtle animations when user moves mouse over container
    container.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        buttons.forEach(button => {
            button.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
        });
    });
    
    container.addEventListener('mouseleave', () => {
        buttons.forEach(button => {
            button.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
        });
    });
}

// Function to prevent container movement when buttons are clicked
function fixButtonContainerInteraction() {
    const buttons = document.querySelectorAll('.btn-animated');
    
    // Add event listeners to prevent the default container hover behavior when buttons are clicked
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            // Prevent event propagation up to container
            e.stopPropagation();
            
            // Get the container element
            const container = document.querySelector('.container');
            
            // Temporarily disable the hover effect on the container
            container.style.transition = 'none';
            container.style.transform = 'none';
            
            // Re-enable the transition after the click is complete
            setTimeout(() => {
                container.style.transition = 'all 0.5s ease';
            }, 300);
        });
        
        // Prevent mouseup events from propagating to the container as well
        button.addEventListener('mouseup', function(e) {
            e.stopPropagation();
        });
    });
}

// Function to initialize falling letters (alternative implementation)
function initFallingLetters() {
    const bg = document.getElementById('falling-bg');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let i = 0; i < 50; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = letters[Math.floor(Math.random() * letters.length)];
        letter.style.left = `${Math.random() * 100}%`;
        letter.style.fontSize = `${Math.random() * 20 + 14}px`;
        letter.style.animationDuration = `${Math.random() * 10 + 5}s`;
        letter.style.animationDelay = `${Math.random() * 5}s`;
        letter.style.animation = `fall ${Math.random() * 10 + 10}s linear infinite`;
        bg.appendChild(letter);
    }
}

// Check if user is authenticated
document.addEventListener("DOMContentLoaded", async function () {
    const userInfo = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    const authToken = getAuthToken();

    // Create falling letters background (using the more detailed implementation)
    createFallingLetters();
    
    // Add button interaction effects
    addButtonSoundEffects();
    setupButtonInteractions();
    
    // Fix button container interaction (prevent container from moving when buttons are clicked)
    fixButtonContainerInteraction();

    if (!authToken) {
        // Show sweet alert for unauthenticated user
        Swal.fire({
            title: 'Not Logged In',
            text: 'Please log in to continue',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            timer: 2000,
            timerProgressBar: true
        }).then(() => {
            // Redirect to login page if token is missing
            window.location.href = "../login/login.html";
        });
        return;
    }

    // Add welcome animation to container
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s ease-out';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 300);

    // Display login status with a welcome toast
    Swal.fire({
        title: 'Welcome back!',
        text: 'Logged in successfully',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
    
    userInfo.innerText = `Ready to play!`;
    logoutBtn.style.display = "block";
});

// Logout function
function logout() {
    // Use SweetAlert2 for confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of your account",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear auth token from cookies
            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            
            // Show success message
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been logged out successfully',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                // Redirect to login page
                window.location.href = "../login/login.html";
            });
        }
    });
}

// Function to start the game
function startGame() {
    // Button press animation
    const button = document.querySelector('.button-wrapper button');
    if (button) {
        button.classList.add('active');
    }
    
    // Show loading animation
    Swal.fire({
        title: 'Loading Game...',
        html: 'Get ready to twist some letters!',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        // Redirect to the game page
        window.location.href = "../level/level.html";
    });
}

// Function to open profile page
function openProfile() {
    // Show loading animation
    Swal.fire({
        title: 'Loading Profile...',
        timer: 800,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
        showConfirmButton: false
    }).then(() => {
        // Redirect to the profile page
        window.location.href = "../profile/profile.html";
    });
}

// Function to open leaderboard
function openLeaderboard() {
    // Show loading animation
    Swal.fire({
        title: 'Loading Leaderboard...',
        timer: 800,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
        showConfirmButton: false
    }).then(() => {
        // Redirect to the leaderboard page
        window.location.href = "../board/board.html";
    });
}