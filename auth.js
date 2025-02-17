let isSignup = true;
let redirectLink = "Live.html"; // Redirect link

// ✅ Step 1: Request OTP from Backend
async function sendOTP() {
    let email = document.getElementById("signup-email").value;
    if (!email) {
        alert("Enter your email first!");
        return;
    }

    try {
        let response = await fetch("https://your-backend.onrender.com/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        let result = await response.json();
        if (result.success) {
            alert("OTP has been sent to your email.");
            document.getElementById("step-email").style.display = "none";
            document.getElementById("step-otp").style.display = "block";
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Try again.");
    }
}

// ✅ Step 2: Verify OTP with Backend
async function verifyOTP() {
    let email = document.getElementById("signup-email").value;
    let enteredOTP = document.getElementById("otp").value;

    if (!enteredOTP) {
        alert("Enter the OTP!");
        return;
    }

    try {
        let response = await fetch("https://your-backend.onrender.com/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: enteredOTP })
        });

        let result = await response.json();
        if (result.success) {
            alert("OTP Verified!");
            document.getElementById("step-otp").style.display = "none";
            document.getElementById("step-password").style.display = "block";
        } else {
            alert("Invalid OTP! Try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Failed to verify OTP.");
    }
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
async function completeSignup() {
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let name = document.getElementById("name").value;
    let gender = document.getElementById("gender").value;
    let age = document.getElementById("age").value;

    if (!name || !gender || !age) {
        alert("Please complete all details!");
        return;
    }

    try {
        let response = await fetch("https://your-backend.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, age, gender })
        });

        let result = await response.json();
        if (result.success) {
            alert("Signup Successful!");
            window.location.href = redirectLink;
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("Signup failed.");
    }
}

// ✅ LOGIN FUNCTION
async function loginUser() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    try {
        let response = await fetch("https://your-backend.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let result = await response.json();
        if (result.success) {
            alert("Login Successful!");
            window.location.href = redirectLink;
        } else {
            document.getElementById("login-error").style.display = "block";
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed.");
    }
}
