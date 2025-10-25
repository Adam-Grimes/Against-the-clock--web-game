// Default configuration values 
let TOTAL_TIME = 60; // seconds per round
let QUESTIONS_PER_PLAYER = 5;
const MONEY_VALUES = [10, 20, 50, 100];

// Global game state variables
let moneyChosen = 0;
let allQuestions = []; // loaded from questions.json
let player1Questions = [];
let player2Questions = [];
let currentPlayer = 1; // 1 or 2

// DOM element references
const moneyValueElem = document.getElementById('moneyValue');
const timer1Elem = document.getElementById('timer1');
const timer2Elem = document.getElementById('timer2');
const score1Elem = document.getElementById('score1');
const score2Elem = document.getElementById('score2');
const startPlayer1Btn = document.getElementById('startPlayer1');
const startPlayer2Btn = document.getElementById('startPlayer2');
const questionSection = document.getElementById('question-section');
const questionElem = document.getElementById('question');
const answersElem = document.getElementById('answers');
const resultSection = document.getElementById('result-section');
const resultMessageElem = document.getElementById('resultMessage');
const newRoundBtn = document.getElementById('new-round-btn');
const resetBtn = document.getElementById('reset-btn');

const configTimeInput = document.getElementById('config-time');
const configQuestionsInput = document.getElementById('config-questions');
const settingsToggleBtn = document.getElementById('settings-toggle');
const configPanel = document.getElementById('config-panel');

const playerTurnElem = document.getElementById('player-turn');

let playerTimers = { 1: TOTAL_TIME, 2: TOTAL_TIME };
let playerScores = { 1: 0, 2: 0 };
let questionIndex = 0;  // current question index for current player
let roundInterval = null; // continuous round timer

// Utility function to select a random element from an array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Randomly select money value and update display
function initMoney() {
  moneyChosen = getRandomElement(MONEY_VALUES);
  moneyValueElem.textContent = moneyChosen;
}

// Load questions from external JSON file
function loadQuestions() {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      allQuestions = data;
      // Setup questions for new rounds
      setupGameQuestions();
    })
    .catch(error => {
      console.error('Error loading questions:', error);
    });
}

// Set up unique questions for both players based on configuration
function setupGameQuestions() {
  let questionsPool = [...allQuestions];
  player1Questions = [];
  player2Questions = [];
  for (let i = 0; i < QUESTIONS_PER_PLAYER; i++) {
    let index1 = Math.floor(Math.random() * questionsPool.length);
    player1Questions.push(questionsPool.splice(index1, 1)[0]);
    let index2 = Math.floor(Math.random() * questionsPool.length);
    player2Questions.push(questionsPool.splice(index2, 1)[0]);
  }
}

// Start a round for the given player with a continuous timer
function startRound(player) {
  currentPlayer = player;
  questionIndex = 0;
  playerScores[player] = 0;
  playerTimers[player] = TOTAL_TIME;
  updatePlayerDisplay(player);
  
  // Update player-turn label 
  playerTurnElem.textContent = `Player ${player}:`;

  // Hide result section and show question section
  resultSection.classList.add('hidden');
  questionSection.classList.remove('hidden');
  newRoundBtn.classList.add('hidden');
  
  // Start continuous timer for the round
  const startTime = Date.now();
  if (roundInterval) clearInterval(roundInterval);
  roundInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let remaining = TOTAL_TIME - elapsed;
    if (remaining < 0) remaining = 0;
    playerTimers[currentPlayer] = remaining;
    updatePlayerDisplay(currentPlayer);
    if (remaining <= 0) {
      clearInterval(roundInterval);
      endRoundDueToTime();
    }
  }, 100);
  
  // Display the first question
  displayNextQuestion();
}

// Update the timer and score displays for a player
function updatePlayerDisplay(player) {
  if (player === 1) {
    timer1Elem.textContent = playerTimers[player];
    score1Elem.textContent = playerScores[player];
  } else {
    timer2Elem.textContent = playerTimers[player];
    score2Elem.textContent = playerScores[player];
  }
}

// Display the next question for the current player
function displayNextQuestion() {
  // Determine the current question based on the active player
  let currentQuestion;
  if (currentPlayer === 1) {
    currentQuestion = player1Questions[questionIndex];
  } else {
    currentQuestion = player2Questions[questionIndex];
  }

  // Display the current question's text in the question element
  questionElem.textContent = currentQuestion.question;
  
  // Clear any previous answers
  answersElem.innerHTML = '';

  // Create buttons for each answer
  for (let idx = 0; idx < currentQuestion.answers.length; idx++) {
    const answer = currentQuestion.answers[idx];
    const btn = document.createElement('button');
    btn.classList.add('answer-btn');
    btn.textContent = answer;

    // Attach a click event listener for processing the answer
    btn.addEventListener('click', function() {
      processAnswer(idx, currentQuestion.correct);
    });
    
    // Append the button to the answers element
    answersElem.appendChild(btn);
  }
}


// Process answer selection without stopping the timer
function processAnswer(selectedIndex, correctIndex) {
  if (selectedIndex === correctIndex) {
    playerScores[currentPlayer]++;
    updatePlayerDisplay(currentPlayer);
  }
  questionIndex++;
  if (playerScores[currentPlayer] >= QUESTIONS_PER_PLAYER || questionIndex >= QUESTIONS_PER_PLAYER) {
    clearInterval(roundInterval);
    endRound();
  } else {
    displayNextQuestion();
  }
}

// Handle round end due to time expiration
function endRoundDueToTime() {
  resultMessageElem.textContent = `Player ${currentPlayer} ran out of time!`;
  resultSection.classList.remove('hidden');
  
  // Hide New Round button only for Player 1 timeout
  if (currentPlayer === 1) {
    newRoundBtn.classList.add('hidden');
  } else {
    newRoundBtn.classList.remove('hidden');
  }
  
  endRound();
}

// End a player's round and prepare for the next phase
function endRound() {
  questionElem.textContent = '';
  answersElem.innerHTML = '';
  questionSection.classList.add('hidden');
  if (currentPlayer === 1) {
    startPlayer2Btn.disabled = false;
  } else {
    displayFinalResult();
  }
}

// Compare players' remaining time and display final results
function displayFinalResult() {
  let winner;
  
  if (playerScores[1] > playerScores[2]) {
    winner = "Player 1";
  } else if (playerScores[2] > playerScores[1]) {
    winner = "Player 2";
  } else {
    // If scores are tied, use remaining time as a tiebreaker
    if (playerTimers[1] > playerTimers[2]) {
      winner = "Player 1";
    } else if (playerTimers[2] > playerTimers[1]) {
      winner = "Player 2";
    } else {
      winner = "No one, it's a tie";
    }
  }
  
  let winnings = "";
  // Calculate winnings based on the winning player's remaining time
  if (winner === "Player 1") {
    winnings = `Winnings: €${playerTimers[1] * moneyChosen}`;
  } else if (winner === "Player 2") {
    winnings = `Winnings: €${playerTimers[2] * moneyChosen}`;
  }
  
  resultMessageElem.textContent = `${winner} wins! ${winnings}`;
  resultSection.classList.remove('hidden');
  
  newRoundBtn.classList.remove('hidden');
}


// Reset the game so settings take effect for new rounds
function resetGame() {
  // Clear any ongoing timers and reset state
  clearInterval(roundInterval);
  currentPlayer = 1;
  questionIndex = 0;
  playerTimers = { 1: TOTAL_TIME, 2: TOTAL_TIME };
  playerScores = { 1: 0, 2: 0 };
  // Reset display values
  timer1Elem.textContent = TOTAL_TIME;
  timer2Elem.textContent = TOTAL_TIME;
  score1Elem.textContent = 0;
  score2Elem.textContent = 0;
  startPlayer1Btn.disabled = false;
  startPlayer2Btn.disabled = true;
  questionSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  resultMessageElem.classList.remove('timeout');
  newRoundBtn.classList.remove('hidden');

  // Reinitialize questions based on current settings
  setupGameQuestions();
  // Reinitialize money value
  initMoney();
}

// Auto-update configuration when settings change (applies only on new round/reset)
function applyConfig() {
  const newTime = parseInt(configTimeInput.value, 10);
  const newQuestions = parseInt(configQuestionsInput.value, 10);
  if (!isNaN(newTime) && newTime > 0) {
    TOTAL_TIME = newTime;
  }
  if (!isNaN(newQuestions) && newQuestions > 0) {
    QUESTIONS_PER_PLAYER = newQuestions;
  }
  // Settings changes will be applied next time resetGame() is called.
}

// Toggle configuration panel when settings icon is clicked
settingsToggleBtn.addEventListener('click', () => {
  configPanel.classList.toggle('hidden');
});

// Event listeners for start buttons
startPlayer1Btn.addEventListener('click', () => {
  startPlayer1Btn.disabled = true;
  startRound(1);
});
startPlayer2Btn.addEventListener('click', () => {
  startPlayer2Btn.disabled = true;
  startRound(2);
});

// Event listener for reset button
resetBtn.addEventListener('click', resetGame);

// Event listener for New Round button at the end of a game
newRoundBtn.addEventListener('click', resetGame);

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
  initMoney();
  loadQuestions();
});

document.getElementById('apply-settings').addEventListener('click', () => {
  applyConfig(); // Update settings
  resetGame();   // Reset game to apply changes
});

document.addEventListener('click', (e) => {
  const isSettingsClick = e.target.closest('#settings-container');
  const isSettingsToggle = e.target.closest('#settings-toggle');
  
  if (!isSettingsClick && !isSettingsToggle && !configPanel.classList.contains('hidden')) {
    configPanel.classList.add('hidden');
  }
});

// Prevent clicks inside settings panel from closing it
configPanel.addEventListener('click', (e) => {
  e.stopPropagation();
});
