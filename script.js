const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
const moveLimit = 20; // Set a move limit
let timerInterval;
let timeElapsed = 0;
const timeLimit = 100; // Set a time limit in seconds

// Shuffle cards
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Initialize game
function initGame() {
    cards = shuffle([...cardValues]);
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
    showMessage(''); // Clear message on new game
}

// Flip card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Prevent flipping if the game is over or move limit is reached
    if (moves >= moveLimit || document.getElementById('game-message').textContent !== '') return;

    this.classList.add('flipped');
    this.textContent = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check for match
function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
    } else {
        unflipCards();
    }
    moves++;
    document.getElementById('moves').textContent = moves;
    checkGameOver();
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

// Unflip cards
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1000);
}

// Reset board
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Reset game
function resetGame() {
    clearInterval(timerInterval);
    timeElapsed = 0;
    moves = 0;
    document.getElementById('moves').textContent = moves;
    document.getElementById('move-limit').textContent = moveLimit;
    document.getElementById('time-left').textContent = formatTime(timeLimit);
    initGame();
    startTimer();
    document.getElementById('start-match').disabled = true; // Disable button
    showMessage(''); // Clear message on game start
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        const timeLeft = timeLimit - timeElapsed;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame('Time up! Game over.');
        } else {
            document.getElementById('time-left').textContent = formatTime(timeLeft);
        }
    }, 1000);
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

let isPaused = false;

// Pause game
function pauseGame() {
    if (isPaused) {
        startTimer(); // Restart timer
        document.getElementById('pause-game').textContent = 'Pause';
        isPaused = false;
    } else {
        clearInterval(timerInterval); // Stop timer
        document.getElementById('pause-game').textContent = 'Resume';
        isPaused = true;
    }
}

// Event listeners
document.getElementById('start-match').addEventListener('click', () => {
    resetGame();
});

document.getElementById('pause-game').addEventListener('click', () => {
    pauseGame();
});

document.getElementById('reset-game').addEventListener('click', () => {
    resetGame();
});

// Check if game is over (win condition)
function checkGameOver() {
    const matchedCards = document.querySelectorAll('.matched').length;
    if (matchedCards === cardValues.length) {
        endGame('Congratulations! You won the match!');
    } else if (moves >= moveLimit) {
        endGame('Move limit reached! Game over.');
    }
}

// End game
function endGame(message) {
    clearInterval(timerInterval); // Stop the timer
    showMessage(message);
    document.getElementById('start-match').disabled = false; // Re-enable button
}

// Display message
function showMessage(message) {
    document.getElementById('game-message').textContent = message;
}

// Handle start match button click
document.getElementById('start-match').addEventListener('click', () => {
    resetGame();
});
