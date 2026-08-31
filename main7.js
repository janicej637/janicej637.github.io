"use strict";

/* =========================================================
   ARSENAL PLAYER FLASHCARDS
   Main JavaScript for index12a.html
   ========================================================= */

/*
   IMPORTANT:
   The HTML contains four <input type="text"> elements.
   This script converts them into clickable answer choices.
*/

/* =========================================================
   PLAYER DATA
   ========================================================= */

const players = [

    {
        name: "Bukayo Saka",
        number: 7,
        position: "Forward",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Bukayo%20Saka%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "William Saliba",
        number: 2,
        position: "Defender",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/William%20Saliba%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Gabriel Magalhães",
        number: 6,
        position: "Defender",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel%20Magalhaes%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Jurrien Timber",
        number: 12,
        position: "Defender",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Jurrien%20Timber%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Martin Ødegaard",
        number: 8,
        position: "Midfielder",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Martin%20Odegaard%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Declan Rice",
        number: 41,
        position: "Midfielder",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Declan%20Rice%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Mikel Merino",
        number: 23,
        position: "Midfielder",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mikel%20Merino%20Arsenal%20FC%202024.jpg"
    },

    {
        name: "Gabriel Martinelli",
        number: 11,
        position: "Forward",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel%20Martinelli%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Myles Lewis-Skelly",
        number: 49,
        position: "Defender",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Myles%20Lewis-Skelly%20Arsenal%20FC%202024.jpg"
    },

    {
        name: "Ethan Nwaneri",
        number: 22,
        position: "Midfielder",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ethan%20Nwaneri%20Arsenal%20FC%202024.jpg"
    },

    {
        name: "Leandro Trossard",
        number: 19,
        position: "Forward",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Leandro%20Trossard%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Kai Havertz",
        number: 29,
        position: "Forward",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kai%20Havertz%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Gabriel Jesus",
        number: 9,
        position: "Forward",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel%20Jesus%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "Ben White",
        number: 4,
        position: "Defender",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Ben%20White%20Arsenal%20FC%202023.jpg"
    },

    {
        name: "David Raya",
        number: 22,
        position: "Goalkeeper",
        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/David%20Raya%20Arsenal%20FC%202023.jpg"
    }

];


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const playerImage =
    document.getElementById("player-image");

const question =
    document.getElementById("question");

const answerContainer =
    document.getElementById("answers");

const submitButton =
    document.getElementById("submit");

const nextButton =
    document.getElementById("next");

const result =
    document.getElementById("result");

const scoreNumber =
    document.getElementById("score-number");

const correctCount =
    document.getElementById("correct-count");

const attemptCount =
    document.getElementById("attempt-count");

const accuracy =
    document.getElementById("accuracy");

const progressBar =
    document.getElementById("progress-bar");

const progressText =
    document.getElementById("progress-text");


/* =========================================================
   GAME VARIABLES
   ========================================================= */

let currentPlayer = null;

let selectedAnswer = "";

let correctAnswers = 0;

let totalAttempts = 0;

let questionsAnswered = 0;

let questionDeck = [];

let answered = false;


/* =========================================================
   SHUFFLE
   ========================================================= */

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }

    return result;
}


/* =========================================================
   GET NEXT PLAYER
   ========================================================= */

function getNextPlayer() {

    if (questionDeck.length === 0) {

        questionDeck =
            shuffle(players);

    }

    return questionDeck.pop();
}


/* =========================================================
   GET FOUR ANSWERS
   ========================================================= */

function createAnswers(correctPlayer) {

    const incorrectPlayers =
        shuffle(
            players.filter(
                player =>
                    player.name !==
                    correctPlayer.name
            )
        ).slice(0, 3);

    return shuffle([
        correctPlayer,
        ...incorrectPlayers
    ]);
}


/* =========================================================
   UPDATE SCORE
   ========================================================= */

function updateScore() {

    scoreNumber.textContent =
        correctAnswers;

    correctCount.textContent =
        correctAnswers;

    attemptCount.textContent =
        totalAttempts;

    let percentage = 0;

    if (totalAttempts > 0) {

        percentage =
            Math.round(
                (correctAnswers /
                    totalAttempts) *
                100
            );

    }

    accuracy.textContent =
        percentage + "%";


    /*
       Progress is based on the number of
       players answered in the current cycle.
    */

    const progress =
        Math.min(
            100,
            Math.round(
                (questionsAnswered /
                    players.length) *
                100
            )
        );

    progressBar.style.width =
        progress + "%";

    progressText.textContent =
        progress + "%";
}


/* =========================================================
   CLEAR FEEDBACK
   ========================================================= */

function clearFeedback() {

    result.textContent = "";

    result.className = "";

    document.body.classList.remove(
        "answer-correct",
        "answer-wrong"
    );

}


/* =========================================================
   LOAD PLAYER IMAGE
   ========================================================= */

function loadPlayerImage(player) {

    playerImage.alt =
        player.name +
        " Arsenal player";

    playerImage.style.opacity = "0";

    playerImage.src =
        player.image;

    playerImage.onload = function () {

        playerImage.style.opacity = "1";

    };


    /*
       Fallback if the external image fails.
    */

    playerImage.onerror = function () {

        playerImage.onerror = null;

        playerImage.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="600"
                    height="700"
                    viewBox="0 0 600 700"
                >

                    <defs>

                        <linearGradient
                            id="background"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stop-color="#db0007"
                            />

                            <stop
                                offset="100%"
                                stop-color="#650004"
                            />

                        </linearGradient>

                    </defs>

                    <rect
                        width="600"
                        height="700"
                        fill="#090909"
                    />

                    <circle
                        cx="300"
                        cy="300"
                        r="220"
                        fill="url(#background)"
                    />

                    <circle
                        cx="300"
                        cy="300"
                        r="175"
                        fill="none"
                        stroke="#d4af37"
                        stroke-width="3"
                    />

                    <text
                        x="300"
                        y="290"
                        text-anchor="middle"
                        fill="white"
                        font-family="Arial"
                        font-size="40"
                        font-weight="900"
                    >
                        ARSENAL
                    </text>

                    <text
                        x="300"
                        y="345"
                        text-anchor="middle"
                        fill="#d4af37"
                        font-family="Arial"
                        font-size="25"
                        font-weight="700"
                    >
                        ${player.name}
                    </text>

                </svg>

            `);

        playerImage.style.opacity = "1";

    };

}


/* =========================================================
   DISPLAY ANSWERS
   ========================================================= */

function displayAnswers() {

    const choices =
        createAnswers(currentPlayer);


    /*
       The original HTML has four text inputs.
       Convert them into buttons.
    */

    const oldInputs =
        [
            ...answerContainer.querySelectorAll(
                "input"
            )
        ];


    oldInputs.forEach(
        (input, index) => {

            const choice =
                choices[index];

            if (!choice) return;


            /*
               Change text input into a button.
            */

            input.type = "button";

            input.value =
                choice.name;

            input.dataset.answer =
                choice.name;

            input.dataset.selected =
                "false";

            input.disabled =
                false;

            input.className = "";

            input.setAttribute(
                "aria-label",
                "Answer: " +
                choice.name
            );


            /*
               Clicking an answer.
            */

            input.onclick =
                function () {

                    if (answered) return;


                    selectedAnswer =
                        choice.name;


                    /*
                       Remove selected state
                       from all answers.
                    */

                    oldInputs.forEach(
                        other => {

                            other.classList.remove(
                                "selected"
                            );

                            other.dataset.selected =
                                "false";

                        }
                    );


                    /*
                       Highlight selected answer.
                    */

                    input.classList.add(
                        "selected"
                    );

                    input.dataset.selected =
                        "true";

                };

        }
    );

}


/* =========================================================
   LOAD NEW QUESTION
   ========================================================= */

function loadQuestion() {

    currentPlayer =
        getNextPlayer();

    selectedAnswer =
        "";

    answered =
        false;

    questionsAnswered++;


    clearFeedback();


    question.textContent =
        "Who is the Arsenal player shown below?";


    loadPlayerImage(
        currentPlayer
    );


    displayAnswers();


    submitButton.disabled =
        false;

    nextButton.disabled =
        true;

    submitButton.textContent =
        "✓  Submit Answer";


    updateScore();

}


/* =========================================================
   SUBMIT ANSWER
   ========================================================= */

function submitAnswer() {

    if (answered) return;


    /*
       Make sure the user selected
       an answer.
    */

    if (!selectedAnswer) {

        result.textContent =
            "Please choose one of the four players.";

        result.className =
            "incorrect";

        return;

    }


    answered =
        true;

    totalAttempts++;


    const isCorrect =
        selectedAnswer.toLowerCase() ===
        currentPlayer.name.toLowerCase();


    if (isCorrect) {

        correctAnswers++;

        result.textContent =
            "✓ Correct! That's " +
            currentPlayer.name +
            ".";

        result.className =
            "correct";

        document.body.classList.add(
            "answer-correct"
        );

    }

    else {

        result.textContent =
            "✗ Incorrect. The player is " +
            currentPlayer.name +
            ".";

        result.className =
            "incorrect";

        document.body.classList.add(
            "answer-wrong"
        );

    }


    /*
       Lock all answer buttons.
    */

    const answerInputs =
        [
            ...answerContainer.querySelectorAll(
                "input"
            )
        ];


    answerInputs.forEach(
        input => {

            input.disabled =
                true;


            /*
               Always show the correct
               answer in green.
            */

            if (
                input.dataset.answer &&
                input.dataset.answer.toLowerCase() ===
                currentPlayer.name.toLowerCase()
            ) {

                input.classList.add(
                    "correct"
                );

            }


            /*
               Mark selected wrong answer.
            */

            if (
                input.dataset.selected ===
                    "true" &&
                !isCorrect
            ) {

                input.classList.add(
                    "incorrect"
                );

            }

        }
    );


    submitButton.disabled =
        true;

    nextButton.disabled =
        false;


    if (isCorrect) {

        submitButton.textContent =
            "✓ Correct!";

    }

    else {

        submitButton.textContent =
            "Answer Submitted";

    }


    updateScore();

}


/* =========================================================
   NEXT PLAYER
   ========================================================= */

function nextPlayer() {

    loadQuestion();

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

submitButton.addEventListener(
    "click",
    submitAnswer
);


nextButton.addEventListener(
    "click",
    nextPlayer
);


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            if (!answered) {

                submitAnswer();

            }

            else if (
                !nextButton.disabled
            ) {

                nextPlayer();

            }

        }

    }
);


/* =========================================================
   INITIALIZE GAME
   ========================================================= */

loadQuestion();
