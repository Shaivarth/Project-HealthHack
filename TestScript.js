let currentQuestion = 1;
const totalQuestions = 10;

function showQuestion(index) {
    document.querySelectorAll('.question').forEach((q, i) => {
        q.style.display = i === index - 1 ? "block" : "none";
    });

    document.getElementById("backBtn").disabled = index === 1;
    document.getElementById("nextBtn").style.display = index < totalQuestions ? "inline-block" : "none";
    document.getElementById("submitBtn").style.display = index === totalQuestions ? "inline-block" : "none";
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function prevQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

function analyzeResults() {
    let yesCount = 0;
    for (let i = 1; i <= totalQuestions; i++) {
        let selected = document.querySelector('input[name="q' + i + '"]:checked');
        if (!selected) {
            openPopup();
            return;
        }
        if (selected.value === "yes") {
            yesCount++;
        }
    }

    let resultText = "";
    if (yesCount <= 3) {
        resultText = "<h3>You Seem to be Doing Well!</h3><p>Your responses suggest that your mental health is in a stable state. Keep taking care of yourself, and reach out for support if needed.</p>";
    } else if (yesCount <= 6) {
        resultText = "<h3>Some Signs Of Stress</h3><p>You might be experiencing some stress or emotional struggles. Consider talking to someone you trust or engaging in activities that help you relax.</p>";
    } else if (yesCount <= 8) {
        resultText = "<h3>Moderate Concerns</h3><p>Your answers suggest that you may be facing some mental health challenges. Seeking support from a counselor or therapist could be helpful.</p>";
    } else {
        resultText = "<h3>Consider Seeking Support</h3><p>Your responses indicate that you're going through a difficult time. It may help to talk to a professional or someone who can support you.</p>";
    }

    document.getElementById("result").innerHTML = resultText;
}

function openPopup() {
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

showQuestion(currentQuestion);
