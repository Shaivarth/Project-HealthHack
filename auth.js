let isSignup = true;
let generatedOTP = ""; // Store OTP for verification
let users = {}; // Dummy user storage
let redirectLink = "http://127.0.0.1:5500/Live.html"; // Add your redirect link here

// ✅ Step 1: Send OTP
function sendOTP() {
    let email = document.getElementById("signup-email").value;
    if (!email) {
        alert("Enter your email first!");
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    alert("Your OTP is: " + generatedOTP); // Simulating OTP send (Replace with email API)
    
    document.getElementById("step-email").style.display = "none";
    document.getElementById("step-otp").style.display = "block";
}

// ✅ Step 2: Verify OTP
function verifyOTP() {
    let enteredOTP = document.getElementById("otp").value;
    if (enteredOTP !== generatedOTP) {
        alert("Invalid OTP! Try again.");
        return;
    }

    alert("OTP Verified!");
    document.getElementById("step-otp").style.display = "none";
    document.getElementById("step-password").style.display = "block";
}

// ✅ Step 3: Move to User Details
function nextToDetails() {
    let password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;

    if (!password || !confirmPassword) {
        alert("Please enter and confirm your password!");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    document.getElementById("step-password").style.display = "none";
    document.getElementById("step-details").style.display = "block";
}

// ✅ Step 4: Complete Signup & Redirect
function completeSignup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let name = document.getElementById("name").value;
    let gender = document.getElementById("gender").value;
    let age = document.getElementById("age").value;

    if (!name || !gender || !age) {
        alert("Please complete all details!");
        return;
    }

    users[email] = { password, name, gender, age }; // Store user details (Replace with backend)
    alert("Signup Successful!");
    
    // Redirect after successful signup
    window.location.href = redirectLink; // Add your redirect link here
}

// ✅ LOGIN FUNCTION
function loginUser() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    if (!users[email] || users[email].password !== password) {
        document.getElementById("login-error").style.display = "block";
        return;
    }

    alert("Login Successful!");
    window.location.href = redirectLink; // Add your redirect link here
}

// ✅ Switch to Login
function switchToLogin() {
    isSignup = false;
    document.getElementById("popupTitle").innerText = "Login";
    document.getElementById("signup-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("switchText").innerHTML = 'New user? <a href="#" onclick="switchToSignup()">Signup</a>';
}

// ✅ Switch to Signup
function switchToSignup() {
    isSignup = true;
    document.getElementById("popupTitle").innerText = "Signup";
    document.getElementById("signup-section").style.display = "block";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("switchText").innerHTML = 'Already have an account? <a href="#" onclick="switchToLogin()">Login</a>';
}

// ✅ Close Popup
function closePopup() {
    window.location.href = "index.html";
}
