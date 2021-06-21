// time display
let timeEl = document.querySelector("h5.time");
//starting time
let timeLeft = 60;
//correct answers
let correct = 0
let scoreEl = document.querySelector("#score");
let scoreE2 = document.querySelector('#correct')
// introduction, question and result sections
const introEl = document.querySelector("#intro");
const questionsEl = document.querySelector("#questions");
const resultEl = document.querySelector("#result");
//question selector
let questionEl = document.querySelector("#question");
// question count
let questionCount = 0;
// correct or wrong answer
const feedbackEl = document.querySelector("#feedback");
// user initials
let initialsInput = document.querySelector("#initials");
// section highscores
const highscoresEl = document.querySelector("#highscores");
// ordered list of submitted scores
let scoreListEl = document.querySelector("#score-list");
// empty array of highscores
let scoreList = [];
// start
const startBtn = document.querySelector("#start");
// answer button class
const ansBtn = document.querySelectorAll("button.ansBtn")
// answer1
const ans1Btn = document.querySelector("#answer1");
// answer2
const ans2Btn = document.querySelector("#answer2");
// answer3
const ans3Btn = document.querySelector("#answer3");
// answer4
const ans4Btn = document.querySelector("#answer4");
// submit-score
const submitScrBtn = document.querySelector("#submit-score");
// goback
const goBackBtn = document.querySelector("#goback");
// clearscores
const clearScrBtn = document.querySelector("#clearscores");
// view/hide scores
const viewScrBtn = document.querySelector("#view-scores");

// array of quiz questions to plug into html page
const quizQuestions = [ 
    {
        question: "'if' and 'else' are examples of",
        answers: ["1. methods", "2. random comparisons", "3. conditional statements", "4. string theory"],
        correctAnswer: "2"
    },
    {
        question: "the correct format for a one line comment in Javascript:",
        answers: ["1. //this is a comment", "2. <!--this is a comment-->", "3. (this is a comment)", "4. /***ducks**/"],
        correctAnswer: "0"
    },
    {
        question: "how to declare a variable called 'password':",
        answers: ["1. variable = password", "2. passwordVar", "3. var password", "4. vassWord"],
        correctAnswer: "2"
    },
    {
        question: "How do you call a function called 'myFunction?'",
        answers: ["1.call myFunction()", "2. myFunction()", "3. getFunction (myFunction)", "4. HEY! myFunction!"],
        correctAnswer: "1"
    },
    {
        question: "This data type can only have one of two values",
        answers: ["1. True", "2. Yes", "3. boolean", "4. bouillon"],
        correctAnswer: "2"
    }
];

// timer function tells time to tick down, stop if questions or timer are down to 0
function setTime() {
    let timerInterval = setInterval(function () {
        timeLeft--;
        timeEl.textContent = `Time:${timeLeft}s`;

        if (timeLeft === 0 || questionCount === quizQuestions.length) {
            clearInterval(timerInterval);
            questionsEl.style.display = "none";
            resultEl.style.display = "block";
            scoreEl.textContent = timeLeft;
            scoreE2.textContent = correct;
        }
    }, 1000);
}

// function that starts quiz, hides introdcution, displays questions and answer choices, starts timer function
function startQuiz() {
    introEl.style.display = "none";
    questionsEl.style.display = "block";
    questionCount = 0;

    setTime();
    setQuestion(questionCount);
}

// function plugs correcsponding question and answer choices into buttons on page
function setQuestion(id) {
    if (id < quizQuestions.length) {
        questionEl.textContent = quizQuestions[id].question;
        ans1Btn.textContent = quizQuestions[id].answers[0];
        ans2Btn.textContent = quizQuestions[id].answers[1];
        ans3Btn.textContent = quizQuestions[id].answers[2];
        ans4Btn.textContent = quizQuestions[id].answers[3];
    }
}

// function to check answer give feedback and then move to next question
function checkAnswer(event) {
    event.preventDefault();

    feedbackEl.style.display = "block";
    let h3 = document.createElement("h3");
    feedbackEl.appendChild(h3);

    // feedback disappears
    setTimeout(function () {
        h3.style.display = 'none';
    }, 1000);

    // answer check gives feedback and counts correct answers
    if (quizQuestions[questionCount].correctAnswer === event.target.value) {
        h3.textContent = "Correct!";
        correct++;
    } else if (quizQuestions[questionCount].correctAnswer !== event.target.value) {
        timeLeft = timeLeft - 10;
        h3.textContent = "Wrong!";
        correct += 0;
    }

    // if statment loads next question if questions remain
    if (questionCount < quizQuestions.length) {
        questionCount++;
    }
    // call setQuestion to bring in next question when any answer button is clicked
    setQuestion(questionCount);
}

//save scores to local storage
function saveScores() {
    localStorage.setItem("scoreList", JSON.stringify(scoreList));
}

//retreive scores from local storage if score was entered it is added to storage
function displayScores() {
    let storedScoreList = JSON.parse(localStorage.getItem("scoreList"));

     
    if (storedScoreList !== null) {
        scoreList = storedScoreList;
    }
}
//function hides result and brings up highscores section, calculates user score and saves to localstorage with initials inputted, 
//scores are ranked highest to lowest in ordered list, push method adds initials and score to empty scorelist array

function addScore(event) {
    event.preventDefault();

    resultEl.style.display = "none";
    highscoresEl.style.display = "block";

    let init = initialsInput.value;
    scoreList.push({ initials: init, score: timeLeft * correct });

    scoreList = scoreList.sort((a, b) => {
        if (a.score < b.score) {
          return 1;
        } else {
          return -1;
        }
      });
    
    scoreListEl.innerHTML="";
    for (let i = 0; i < scoreList.length; i++) {
        let li = document.createElement("li");
        li.textContent = `${scoreList[i].initials}: ${scoreList[i].score}`;
        scoreListEl.append(li);
    }

    
    saveScores();
    displayScores();
}



// clear scores from local storage
function clearScores() {
    localStorage.clear();
    scoreListEl.innerHTML="";
}


// when user clicks start button startQuiz fucntion is called
startBtn.addEventListener("click", startQuiz);

// when user clicks an answer option checkAnswer function is called
ansBtn.forEach(item => {
    item.addEventListener('click', checkAnswer);
});

// when user enter initials and clicks submit addScore function is called
submitScrBtn.addEventListener("click", addScore);

// when user clicks, quiz restarts, timer and counter are reset
goBackBtn.addEventListener("click", function () {
    highscoresEl.style.display = "none";
    introEl.style.display = "block";
    correct = 0;
    timeLeft = 60;
    timeEl.textContent = `Time:${timeLeft}s`;
});

// Clear the scores
clearScrBtn.addEventListener("click", clearScores);

// View or hide high scores, if no scores are saved alert
viewScrBtn.addEventListener("click", function () {
    if (highscoresEl.style.display === "none") {
        highscoresEl.style.display = "block";
    } else if (highscoresEl.style.display === "block") {
        highscoresEl.style.display = "none";
    } else {
        return alert("There are no scores yet");
    }
});

//this broke my brain and consumed my week, I got no other work done of any kind 