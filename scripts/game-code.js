// create and assign game elements
const gameElements = {
    gameWrapper: document.querySelector('.game-wrapper'),
    gameButtons: Array.from(document.querySelector('.game-wrapper').children),
    gameScore: document.querySelector('.scoreboard__box--score'),
    resultWrapper: document.querySelector('.result-wrapper'),
    gameResult: document.querySelector('.game-result'),
    playerSelectionBtn: document.querySelector('.player-selection'),
    houseSelectionBtn: document.querySelector('.house-selection'),
    resultBox: document.querySelector('.result-box'),
    playAgain: document.querySelector('.btn-play-again'),
    loadingDot: document.querySelector('.loading-dot'),
    gameReset: document.querySelector('.btn-reset')
};

let houseSelection, playerSelection;
let result = false;

// preserve the score on page refresh 
let score = localStorage.getItem('score') ? (JSON.parse(localStorage.getItem('score'))) : 0;
console.log('score: ', score); // for testing and debugging
gameElements.gameScore.textContent = score;

// play the round when a game button is clicked
for (let elem of gameElements.gameButtons) {
    elem.addEventListener('click', playRound);
}

// get computer selection
function computerPlay() {
    let randomSelection = Math.floor(Math.random() * gameElements.gameButtons.length);
    houseSelection = gameElements.gameButtons[randomSelection].className;
    return houseSelection;
}

// get player selection and run game logic
function playRound(event) {
    playerSelection = event.currentTarget.className;
    houseSelection = computerPlay();
    getResult(playerSelection, houseSelection);
    renderResultScreen();
}

// compare the selections and get the result
function getResult(playerSelection, houseSelection) {
    if (playerSelection === houseSelection) {
        result = undefined;
    } else if (playerSelection === 'btn-paper' && houseSelection === 'btn-rock') {
        result = true;
    } else if (playerSelection === 'btn-rock' && houseSelection === 'btn-scissors') {
        result = true;
    } else if (playerSelection === 'btn-scissors' && houseSelection === 'btn-paper') {
        result = true;
    } else {
        result = false;
    }
    return result;
}

// print the result and increment score for win, decrement score for loss
function printResult() {
    switch(result) {
        case undefined:
            gameElements.gameResult.textContent = 'It\'s a Draw';
            break;
        case true:
            gameElements.playerSelectionBtn.classList.add('is-winner');
            gameElements.gameResult.textContent = 'You Win';
            score++;
            gameElements.gameScore.textContent = score;
            break;
        case false:
            gameElements.gameResult.textContent = 'You Lose';
            gameElements.houseSelectionBtn.classList.add('is-winner');
            score--;
            gameElements.gameScore.textContent = score;
            break;
    }
    console.log(`result: ${gameElements.gameResult.textContent}`); // for testing and debugging

    // store the game score to preserve it
    localStorage.setItem('score', JSON.stringify(score));
}

//  hide game screen and show result screen
function renderResultScreen() {
    gameElements.gameWrapper.style.display = 'none';
    gameElements.resultWrapper.style.display = 'grid';
    gameElements.houseSelectionBtn.style.display = 'none'; //hide house selection initially
    gameElements.resultBox.style.display = 'none'; //hide result box initially

    // add selected button to player selection 
    gameElements.playerSelectionBtn.classList.add(`${playerSelection}`);
    console.log(`your pick: ${playerSelection}`); // for testing and debugging

    // add computer selection after a delay
    setTimeout(function () {
        gameElements.houseSelectionBtn.classList.add(`${houseSelection}`);
        console.log(`house pick: ${houseSelection}`); // for testing and debugging
        gameElements.loadingDot.style.display = 'none';
        gameElements.houseSelectionBtn.style.display = 'grid';
        // show result box after another delay
        setTimeout(function () {
            printResult();
            gameElements.resultBox.style.display = 'initial';
            gameElements.resultBox.style.gridTemplateArea = 'resultBox'
            // resize result wrapper for displaying the result box
            let windowSize = window.matchMedia('(min-width: 992px)');
            if (windowSize.matches) {
                gameElements.resultWrapper.style.width = '80%';
                gameElements.resultWrapper.style.gridTemplateColumns = '1fr 1fr 1fr';
            }
        }, 500)
    }, 3000)
}

// play another round when play again is clicked
gameElements.playAgain.addEventListener('click', renderGameScreen);

// hide result screen and reset all to game screen
function renderGameScreen() {
    gameElements.gameWrapper.style.display = '';
    gameElements.resultWrapper.style.display = '';
    gameElements.resultWrapper.style.width = '';
    gameElements.resultWrapper.style.gridTemplateColumns = '';
    gameElements.playerSelectionBtn.classList.remove(`${playerSelection}`);
    gameElements.houseSelectionBtn.classList.remove(`${houseSelection}`);
    gameElements.playerSelectionBtn.classList.remove('is-winner');
    gameElements.houseSelectionBtn.classList.remove('is-winner');
    gameElements.loadingDot.style.display = '';
}

// reset score when reset button is clicked
gameElements.gameReset.addEventListener('click', resetGame);

function resetGame() {
    score = 0;
    gameElements.gameScore.textContent = score;
    localStorage.clear();
}
