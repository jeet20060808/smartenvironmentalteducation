let currentScreen = 'welcome-screen';
const selectedInterests = new Set();
let currentQuizData = {};

// Function to navigate between screens//
function navigateTo(screenId) {
    const oldScreen = document.getElementById(currentScreen);
    const newScreen = document.getElementById(screenId);
    
    if (oldScreen && newScreen) {
        oldScreen.classList.remove('active');
        newScreen.classList.add('active');
        currentScreen = screenId;

        // Special actions for specific screens
        if (screenId === 'quiz-screen') generateQuiz();
        if (screenId === 'welcome-screen') {
            // Reset state when going home
            document.getElementById('image-preview').style.display = 'none';
            document.getElementById('submit-proof-btn').disabled = true;
            document.getElementById('file-upload').value = '';
        }
    }
}

// Simulated call to a Gemini API to generate quiz questions
async function callGeminiAPI(prompt) {
    // In a real application, this would make an actual API call.
    // For demonstration, we'll simulate a delay and return a static quiz object.
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    return {
        question: "Which of these items is best for composting?",
        options: ["Plastic Bottle", "Glass Jar", "Apple Core", "Aluminum Can"],
        correctAnswerIndex: 2
    };
}

// Toggles the selection state of an interest chip and enables the start button if enough interests are selected
function toggleInterest(element) {
    element.classList.toggle('selected');
    const interestCount = document.querySelectorAll('.interest-chip.selected').length;
    document.getElementById('start-quiz-btn').disabled = interestCount < 3;
}

// Generates a quiz by calling the simulated API and then displays it
async function generateQuiz() {
    const loader = document.getElementById('quiz-loader');
    const container = document.getElementById('quiz-container');
    
    loader.style.display = 'block';
    container.style.display = 'none';
    
    currentQuizData = await callGeminiAPI("Generate quiz");
    
    loader.style.display = 'none';
    displayQuiz();
    container.style.display = 'block';
}

// Displays the generated quiz question and options
function displayQuiz() {
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = ''; // Clear previous options
    questionEl.textContent = currentQuizData.question;
    
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.onclick = () => selectAnswer(button, index);
        optionsEl.appendChild(button);
    });
}

// Handles the user selecting an answer to a quiz question
function selectAnswer(button, selectedIndex) {
    const isCorrect = selectedIndex === currentQuizData.correctAnswerIndex;
    button.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    const allOptions = document.querySelectorAll('#quiz-options .option-btn');
    allOptions.forEach((btn, index) => {
        btn.disabled = true;
        // Highlight the correct answer if the user chose incorrectly
        if (!isCorrect && index === currentQuizData.correctAnswerIndex) {
            btn.classList.add('correct');
        }
    });
    
    // Add a "Next Task" button after a delay
    setTimeout(() => {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next Task →';
        nextButton.className = 'primary-button';
        nextButton.style.marginTop = '20px';
        nextButton.onclick = () => navigateTo('task-screen');
        document.getElementById('quiz-options').appendChild(nextButton);
    }, 1000); // Delay of 1 second
}

// Handles the file upload for task proof, displaying a preview and enabling the submit button
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        const preview = document.getElementById('image-preview');
        const submitBtn = document.getElementById('submit-proof-btn');
        
        reader.onload = function(e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.display = 'block';
            submitBtn.disabled = false; // Enable submit button
        }
        reader.readAsDataURL(file);
    }
}