const dice = [1, 1, 1, 1, 1]; // Initial dice values
let rollsLeft = 3;
let turnsLeft = 13;

// Initialize scores
const scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    "three-kind": 0,
    "four-kind": 0,
    "full-house": 0,
    "small-straight": 0,
    "large-straight": 0,
    yahtzee: 0,
    chance: 0
};

document.getElementById('roll-button').addEventListener('click', () => {
    rollDice();
    updateDynamicScores();
});

document.querySelectorAll('#score-list li').forEach((item) => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        if (scores[category] === 0) {
            const calculatedScore = calculateScore(category, dice);
            scores[category] = calculatedScore; // Record the score (even if 0)
            document.getElementById(`score-${category}`).textContent = calculatedScore;
            updateTotalScore();
            resetTurn();
        } else {
            alert('Category already scored!');
        }
    });
});

// Dice Elements
const diceElements = document.querySelectorAll('.die');
diceElements.forEach((die, index) => {
    die.addEventListener('click', () => {
        die.classList.toggle('held'); // Toggle the "held" state
    });
});

function rollDice() {
    if (rollsLeft > 0) {
        // Initialize dice on first roll
        if (rollsLeft === 3) {
            dice.forEach((_, i) => {
                dice[i] = Math.floor(Math.random() * 6) + 1;
                diceElements[i].textContent = getDieFace(dice[i]);
            });
            console.log('Initialized dice for first roll:', dice);
        }

        diceElements.forEach((die, i) => {
            if (!die.classList.contains('held')) {
                die.classList.add('rolling');
                setTimeout(() => {
                    dice[i] = Math.floor(Math.random() * 6) + 1; // Roll dice
                    die.textContent = getDieFace(dice[i]); // Update UI
                    die.classList.remove('rolling');
                }, 500); // Match the animation duration
            }
        });
        rollsLeft--;
        console.log('Dice values after roll:', dice); // Log dice values
        updateDynamicScores(); // Update scorecard after rolling
    } else {
        alert('No rolls left this turn!');
    }
}

function updateDynamicScores() {
    console.log('Updating dynamic scores...');
    document.querySelectorAll("#score-list li").forEach((item) => {
        const category = item.getAttribute("data-category");
        let potentialScore;

        if (scores[category] === 0) {
            potentialScore = calculateScore(category, dice); // Calculate score
            item.querySelector("span").textContent = potentialScore;

            if (potentialScore > 0) {
                item.style.backgroundColor = "#c8e6c9"; // Green for valid
            } else {
                item.style.backgroundColor = "#ffcdd2"; // Red for invalid
            }
        } else {
            item.style.backgroundColor = "#e0e0e0"; // Gray for scored
        }
    });
    console.log('Dice values for dynamic scores:', dice); // Log dice values
}

function getDieFace(value) {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
}

function resetTurn() {
    rollsLeft = 3;
    diceElements.forEach((die) => die.classList.remove('held')); // Reset all dice
    if (--turnsLeft > 0) {
        updateTurnCounter();
    } else {
        endGame();
    }
}

function updateTotalScore() {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    document.getElementById('total-score').textContent = `Total Score: ${totalScore}`;
}

function calculateScore(category, dice) {
    const counts = Array(7).fill(0); // Count occurrences of each number
    dice.forEach((value) => counts[value]++);

    switch (category) {
        case "ones": return counts[1] * 1;
        case "twos": return counts[2] * 2;
        case "threes": return counts[3] * 3;
        case "fours": return counts[4] * 4;
        case "fives": return counts[5] * 5;
        case "sixes": return counts[6] * 6;        
        case "three-kind": return counts.some((count) => count >= 3) ? dice.reduce((a, b) => a + b, 0) : 0;
        case "four-kind": return counts.some((count) => count >= 4) ? dice.reduce((a, b) => a + b, 0) : 0;
        case "full-house": return counts.some((c) => c === 3) && counts.some((c) => c === 2) ? 25 : 0;
        case "small-straight": return isSmallStraight(dice) ? 30 : 0;
        case "large-straight": return isLargeStraight(dice) ? 40 : 0;
        case "yahtzee": return counts.includes(5) ? 50 : 0;
        case "chance": return dice.reduce((a, b) => a + b, 0);
        default: return 0;
    }
}

function isSmallStraight(dice) {
    const uniqueValues = [...new Set(dice)].sort((a, b) => a - b);
    const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
    ];
    return straights.some((straight) =>
        straight.every((value) => uniqueValues.includes(value))
    );
}

function isLargeStraight(dice) {
    const uniqueValues = [...new Set(dice)].sort((a, b) => a - b);
    const straight1 = [1, 2, 3, 4, 5];
    const straight2 = [2, 3, 4, 5, 6];
    return (
        straight1.every((value) => uniqueValues.includes(value)) ||
        straight2.every((value) => uniqueValues.includes(value))
    );
}

function endGame() {
    alert('Game Over! Calculating final score...');
    updateTotalScore();
    document.getElementById('roll-button').disabled = true;
    document.querySelectorAll('#score-list li').forEach((item) => {
        item.style.pointerEvents = 'none';
    });
}

function updateTurnCounter() {
    document.getElementById('turns-left').textContent = `Turns left: ${turnsLeft}`;
}

document.getElementById('reset-button').addEventListener('click', resetGame);

function resetGame() {
    rollsLeft = 3;
    turnsLeft = 13;
    for (let key in scores) scores[key] = 0;

    dice.forEach((_, i) => {
        dice[i] = 1; // Reset dice values
        const dieElement = document.getElementById(`die${i + 1}`);
        dieElement.textContent = getDieFace(1); // Reset UI to ⚀
        dieElement.classList.remove('held'); // Remove "held" state
    });

    document.querySelectorAll('#score-list li').forEach((item) => {
        const category = item.getAttribute('data-category');
        item.querySelector('span').textContent = '0';
        item.style.pointerEvents = 'auto';
        item.style.backgroundColor = '';
    });

    document.getElementById('roll-button').disabled = false;
    document.getElementById('total-score').textContent = '';
    updateTurnCounter();
    updateDynamicScores(); // Reset dynamic scores after game reset

    console.log('Game reset!');
}
