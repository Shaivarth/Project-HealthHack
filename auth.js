let isSignup = true;
let generatedOTP = ""; // Store OTP for verification
let redirectLink = "Live.html"; // Redirect after successful login/signup

const BACKEND_URL = "https://project-healthhack.onrender.com"; // ✅ Add your Render backend URL

// ✅ Step 1: Send OTP
function sendOTP() {
    let email = document.getElementById("signup-email").value;
    if (!email) {
        alert("Enter your email first!");
        return;
    }

    fetch("https://project-healthhack.onrender.com/send-otp", { // Use your Render backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("OTP sent to your email!"); 
            document.getElementById("step-email").style.display = "none";
            document.getElementById("step-otp").style.display = "block";
        } else {
            alert("Error sending OTP. Try again.");
        }
    })
    .catch(error => console.error("Error:", error));
}



// Verify OTP
function verifyOTP() {
    let enteredOTP = document.getElementById("otp").value;
    let email = document.getElementById("signup-email").value;

    if (!enteredOTP) {
        alert("Please enter the OTP!");
        return;
    }

    fetch(`${BACKEND_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOTP })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("OTP Verified!");
            document.getElementById("step-otp").style.display = "none";
            document.getElementById("step-password").style.display = "block";
        } else {
            alert("Invalid OTP! Try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error verifying OTP. Please try again.");
    });
}

// Complete Signup Function
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
        let response = await fetch(`${BACKEND_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, age, gender }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Signup Successful!");
            localStorage.setItem("token", data.token); // Store JWT token
            window.location.href = redirectLink;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        alert("Signup Failed: " + error.message);
        console.error("Error:", error);
    }
}

// ✅ LOGIN FUNCTION (Authenticate with Backend)
async function loginUser() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    try {
        let response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        let data = await response.json();
        if (!data.success) throw new Error(data.error);

        alert("Login Successful!");
        localStorage.setItem("token", data.token); // Store JWT token
        window.location.href = redirectLink;
    } catch (error) {
        document.getElementById("login-error").style.display = "block";
        document.getElementById("login-error").innerText = error.message;
    }
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
