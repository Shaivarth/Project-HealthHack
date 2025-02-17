const BACKEND_URL = "https://project-healthhack.onrender.com"; // ✅ Add your Render backend URL

// ✅ Step 1: Send OTP
function sendOTP() {
    let email = document.getElementById("signup-email").value;
    if (!email) {
        alert("Enter your email first!");
        return;
    }

    fetch(`${BACKEND_URL}/send-otp`, { // Use your Render backend URL
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

// ✅ Step 2: Verify OTP
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
        console.log("OTP Verification Response:", data);  // ✅ Debug log
    
        if (data.success) {
            console.log("✅ OTP Verified! Redirecting...");
            window.location.href = "https://shaivarth.github.io/Project-HealthHack/Live.html";
        } else {
            console.warn("❌ Invalid OTP. Not redirecting.");
            alert("Invalid OTP! Try again.");
        }
    })
}


// ✅ Close Popup
function closePopup() {
    window.location.href = "index.html";
}