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

// Check if user is authenticated
document.addEventListener("DOMContentLoaded", async function () {
    const userInfo = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    const authToken = getAuthToken();

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