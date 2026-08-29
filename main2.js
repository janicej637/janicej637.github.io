/* =====================================================
   ANIMAL MATCHING GAME
===================================================== */


/*
    Each animal has one image URL.

    We create TWO cards for every animal,
    shuffle them, and place them on the board.
*/

const animals = [

    {
        name: "Lion",
        image: "https://openmoji.org/data/color/svg/1F981.svg"
    },

    {
        name: "Tiger",
        image: "https://openmoji.org/data/color/svg/1F405.svg"
    },

    {
        name: "Elephant",
        image: "https://openmoji.org/data/color/svg/1F418.svg"
    },

    {
        name: "Giraffe",
        image: "https://openmoji.org/data/color/svg/1F992.svg"
    },

    {
        name: "Panda",
        image: "https://openmoji.org/data/color/svg/1F43C.svg"
    },

    {
        name: "Rabbit",
        image: "https://openmoji.org/data/color/svg/1F407.svg"
    },

    {
        name: "Fox",
        image: "https://openmoji.org/data/color/svg/1F98A.svg"
    },

    {
        name: "Frog",
        image: "https://openmoji.org/data/color/svg/1F438.svg"
    },

    {
        name: "Penguin",
        image: "https://openmoji.org/data/color/svg/1F427.svg"
    },

    {
        name: "Monkey",
        image: "https://openmoji.org/data/color/svg/1F412.svg"
    },

    {
        name: "Koala",
        image: "https://openmoji.org/data/color/svg/1F428.svg"
    },

    {
        name: "Zebra",
        image: "https://openmoji.org/data/color/svg/1F993.svg"
    }

];


/* =====================================================
   GAME VARIABLES
===================================================== */

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;

let matches = 0;

let matchedPairs = 0;

let bestScore =
    localStorage.getItem("animalMatchBest") || null;


/* =====================================================
   ELEMENTS
===================================================== */

const gameBoard =
    document.getElementById("gameBoard");

const movesDisplay =
    document.getElementById("moves");

const matchesDisplay =
    document.getElementById("matches");

const bestDisplay =
    document.getElementById("best");

const newGameButton =
    document.getElementById("newGame");

const winMessage =
    document.getElementById("winMessage");

const finalMoves =
    document.getElementById("finalMoves");

const playAgain =
    document.getElementById("playAgain");


/* =====================================================
   SHUFFLE
===================================================== */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

    return array;
}


/* =====================================================
   CREATE CARDS
===================================================== */

function createCards() {

    gameBoard.innerHTML = "";

    const cardData = [];


    /*
        Create TWO cards for every animal.
    */

    animals.forEach(animal => {

        cardData.push({
            ...animal
        });

        cardData.push({
            ...animal
        });

    });


    shuffle(cardData);


    cardData.forEach((animal, index) => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.dataset.animal =
            animal.name;

        card.dataset.index =
            index;


        card.innerHTML = `

            <div class="card-inner">

                <div class="card-back"
                     aria-label="Hidden card">
                </div>

                <div class="card-front">

                    <img
                        src="${animal.image}"
                        alt="${animal.name}"
                    >

                    <span class="animal-name">
                        ${animal.name}
                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => flipCard(card)
        );


        gameBoard.appendChild(card);

    });

}


/* =====================================================
   FLIP CARD
===================================================== */

function flipCard(card) {

    /*
        Don't allow:

        - clicking a flipped card
        - clicking a matched card
        - clicking while two cards are being checked
    */

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched") ||
        card.classList.contains("flipped")
    ) {
        return;
    }


    card.classList.add("flipped");


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    moves++;

    updateScore();

    checkMatch();

}


/* =====================================================
   CHECK MATCH
===================================================== */

function checkMatch() {

    const isMatch =
        firstCard.dataset.animal ===
        secondCard.dataset.animal;


    if (isMatch) {

        handleMatch();

    } else {

        handleMismatch();

    }

}


/* =====================================================
   MATCH
===================================================== */

function handleMatch() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");

    matches++;

    matchedPairs++;

    updateScore();

    resetTurn();


    /*
        Check if the player has matched
        all 12 animal pairs.
    */

    if (matchedPairs === animals.length) {

        setTimeout(
            showWinMessage,
            500
        );

    }

}


/* =====================================================
   NO MATCH
===================================================== */

function handleMismatch() {

    lockBoard = true;


    setTimeout(() => {

        firstCard.classList.remove("flipped");

        secondCard.classList.remove("flipped");

        resetTurn();

    }, 900);

}


/* =====================================================
   RESET TURN
===================================================== */

function resetTurn() {

    [
        firstCard,
        secondCard
    ] = [
        null,
        null
    ];

    lockBoard = false;

}


/* =====================================================
   UPDATE SCORE
===================================================== */

function updateScore() {

    movesDisplay.textContent =
        moves;

    matchesDisplay.textContent =
        `${matches} / ${animals.length}`;

    bestDisplay.textContent =
        bestScore || "--";

}


/* =====================================================
   WIN
===================================================== */

function showWinMessage() {

    finalMoves.textContent =
        moves;

    winMessage.classList.add("show");


    /*
        Save best score.
    */

    if (
        !bestScore ||
        moves < Number(bestScore)
    ) {

        bestScore = moves;

        localStorage.setItem(
            "animalMatchBest",
            bestScore
        );

        bestDisplay.textContent =
            bestScore;

    }

}


/* =====================================================
   START NEW GAME
===================================================== */

function startNewGame() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    moves = 0;

    matches = 0;

    matchedPairs = 0;

    winMessage.classList.remove("show");

    updateScore();

    createCards();

}


/* =====================================================
   BUTTON EVENTS
===================================================== */

newGameButton.addEventListener(
    "click",
    startNewGame
);


playAgain.addEventListener(
    "click",
    startNewGame
);


/* =====================================================
   START GAME
===================================================== */

updateScore();

createCards();
