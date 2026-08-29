// Flag Flashcards - main3.js
// Assignment 3
// Author: Janice James

"use strict";

// ------------------------------------------------------------
// Application variables
// ------------------------------------------------------------

var attemptTotal = 0;
var correctTotal = 0;
var correctAnswer = -1;
var answerSubmitted = false;

var optA;
var optB;
var optC;
var optD;

var answerButtons = [];

// Worldometer flag image location
var baseUrl = "https://www.worldometers.info/images/flags/original/";
var appendUrl = ".webp";

// ------------------------------------------------------------
// Country list
// ISO 3166-1 alpha-2 codes are used for the flag filenames.
// ------------------------------------------------------------

var arrCountry = [
    {name:"Afghanistan", shortName:"af"},
    {name:"Albania", shortName:"al"},
    {name:"Algeria", shortName:"dz"},
    {name:"Andorra", shortName:"ad"},
    {name:"Angola", shortName:"ao"},
    {name:"Antigua and Barbuda", shortName:"ag"},
    {name:"Argentina", shortName:"ar"},
    {name:"Armenia", shortName:"am"},
    {name:"Australia", shortName:"au"},
    {name:"Austria", shortName:"at"},
    {name:"Azerbaijan", shortName:"az"},
    {name:"Bahamas", shortName:"bs"},
    {name:"Bahrain", shortName:"bh"},
    {name:"Bangladesh", shortName:"bd"},
    {name:"Barbados", shortName:"bb"},
    {name:"Belarus", shortName:"by"},
    {name:"Belgium", shortName:"be"},
    {name:"Belize", shortName:"bz"},
    {name:"Benin", shortName:"bj"},
    {name:"Bhutan", shortName:"bt"},
    {name:"Bolivia", shortName:"bo"},
    {name:"Bosnia and Herzegovina", shortName:"ba"},
    {name:"Botswana", shortName:"bw"},
    {name:"Brazil", shortName:"br"},
    {name:"Brunei", shortName:"bn"},
    {name:"Bulgaria", shortName:"bg"},
    {name:"Burkina Faso", shortName:"bf"},
    {name:"Burundi", shortName:"bi"},
    {name:"Cabo Verde", shortName:"cv"},
    {name:"Cambodia", shortName:"kh"},
    {name:"Cameroon", shortName:"cm"},
    {name:"Canada", shortName:"ca"},
    {name:"Central African Republic", shortName:"cf"},
    {name:"Chad", shortName:"td"},
    {name:"Chile", shortName:"cl"},
    {name:"China", shortName:"cn"},
    {name:"Colombia", shortName:"co"},
    {name:"Comoros", shortName:"km"},
    {name:"Congo", shortName:"cg"},
    {name:"Costa Rica", shortName:"cr"},
    {name:"Côte d'Ivoire", shortName:"ci"},
    {name:"Croatia", shortName:"hr"},
    {name:"Cuba", shortName:"cu"},
    {name:"Cyprus", shortName:"cy"},
    {name:"Czechia", shortName:"cz"},
    {name:"Denmark", shortName:"dk"},
    {name:"Djibouti", shortName:"dj"},
    {name:"Dominica", shortName:"dm"},
    {name:"Dominican Republic", shortName:"do"},
    {name:"Democratic People's Republic of Korea", shortName:"kp"},
    {name:"DR Congo", shortName:"cd"},
    {name:"Ecuador", shortName:"ec"},
    {name:"Egypt", shortName:"eg"},
    {name:"El Salvador", shortName:"sv"},
    {name:"Equatorial Guinea", shortName:"gq"},
    {name:"Eritrea", shortName:"er"},
    {name:"Estonia", shortName:"ee"},
    {name:"Eswatini", shortName:"sz"},
    {name:"Ethiopia", shortName:"et"},
    {name:"Fiji", shortName:"fj"},
    {name:"Finland", shortName:"fi"},
    {name:"France", shortName:"fr"},
    {name:"Gabon", shortName:"ga"},
    {name:"Gambia", shortName:"gm"},
    {name:"Georgia", shortName:"ge"},
    {name:"Germany", shortName:"de"},
    {name:"Ghana", shortName:"gh"},
    {name:"Greece", shortName:"gr"},
    {name:"Grenada", shortName:"gd"},
    {name:"Guatemala", shortName:"gt"},
    {name:"Guinea", shortName:"gn"},
    {name:"Guinea-Bissau", shortName:"gw"},
    {name:"Guyana", shortName:"gy"},
    {name:"Haiti", shortName:"ht"},
    {name:"Holy See", shortName:"va"},
    {name:"Honduras", shortName:"hn"},
    {name:"Hungary", shortName:"hu"},
    {name:"Iceland", shortName:"is"},
    {name:"India", shortName:"in"},
    {name:"Indonesia", shortName:"id"},
    {name:"Iran", shortName:"ir"},
    {name:"Iraq", shortName:"iq"},
    {name:"Ireland", shortName:"ie"},
    {name:"Israel", shortName:"il"},
    {name:"Italy", shortName:"it"},
    {name:"Jamaica", shortName:"jm"},
    {name:"Japan", shortName:"jp"},
    {name:"Jordan", shortName:"jo"},
    {name:"Kazakhstan", shortName:"kz"},
    {name:"Kenya", shortName:"ke"},
    {name:"Kiribati", shortName:"ki"},
    {name:"Kuwait", shortName:"kw"},
    {name:"Kyrgyzstan", shortName:"kg"},
    {name:"Laos", shortName:"la"},
    {name:"Latvia", shortName:"lv"},
    {name:"Lebanon", shortName:"lb"},
    {name:"Lesotho", shortName:"ls"},
    {name:"Liberia", shortName:"lr"},
    {name:"Libya", shortName:"ly"},
    {name:"Liechtenstein", shortName:"li"},
    {name:"Lithuania", shortName:"lt"},
    {name:"Luxembourg", shortName:"lu"},
    {name:"Madagascar", shortName:"mg"},
    {name:"Malawi", shortName:"mw"},
    {name:"Malaysia", shortName:"my"},
    {name:"Maldives", shortName:"mv"},
    {name:"Mali", shortName:"ml"},
    {name:"Malta", shortName:"mt"},
    {name:"Marshall Islands", shortName:"mh"},
    {name:"Mauritania", shortName:"mr"},
    {name:"Mauritius", shortName:"mu"},
    {name:"Mexico", shortName:"mx"},
    {name:"Micronesia", shortName:"fm"},
    {name:"Moldova", shortName:"md"},
    {name:"Monaco", shortName:"mc"},
    {name:"Mongolia", shortName:"mn"},
    {name:"Montenegro", shortName:"me"},
    {name:"Morocco", shortName:"ma"},
    {name:"Mozambique", shortName:"mz"},
    {name:"Myanmar", shortName:"mm"},
    {name:"Namibia", shortName:"na"},
    {name:"Nauru", shortName:"nr"},
    {name:"Nepal", shortName:"np"},
    {name:"Netherlands", shortName:"nl"},
    {name:"New Zealand", shortName:"nz"},
    {name:"Nicaragua", shortName:"ni"},
    {name:"Niger", shortName:"ne"},
    {name:"Nigeria", shortName:"ng"},
    {name:"North Macedonia", shortName:"mk"},
    {name:"Norway", shortName:"no"},
    {name:"Oman", shortName:"om"},
    {name:"Pakistan", shortName:"pk"},
    {name:"Palau", shortName:"pw"},
    {name:"Panama", shortName:"pa"},
    {name:"Papua New Guinea", shortName:"pg"},
    {name:"Paraguay", shortName:"py"},
    {name:"Peru", shortName:"pe"},
    {name:"Philippines", shortName:"ph"},
    {name:"Poland", shortName:"pl"},
    {name:"Portugal", shortName:"pt"},
    {name:"Qatar", shortName:"qa"},
    {name:"Romania", shortName:"ro"},
    {name:"Russia", shortName:"ru"},
    {name:"Rwanda", shortName:"rw"},
    {name:"Saint Kitts and Nevis", shortName:"kn"},
    {name:"Saint Lucia", shortName:"lc"},
    {name:"Samoa", shortName:"ws"},
    {name:"San Marino", shortName:"sm"},
    {name:"Sao Tome and Principe", shortName:"st"},
    {name:"Saudi Arabia", shortName:"sa"},
    {name:"Senegal", shortName:"sn"},
    {name:"Serbia", shortName:"rs"},
    {name:"Seychelles", shortName:"sc"},
    {name:"Sierra Leone", shortName:"sl"},
    {name:"Singapore", shortName:"sg"},
    {name:"Slovakia", shortName:"sk"},
    {name:"Slovenia", shortName:"si"},
    {name:"Solomon Islands", shortName:"sb"},
    {name:"Somalia", shortName:"so"},
    {name:"South Africa", shortName:"za"},
    {name:"South Korea", shortName:"kr"},
    {name:"South Sudan", shortName:"ss"},
    {name:"Spain", shortName:"es"},
    {name:"Sri Lanka", shortName:"lk"},
    {name:"St. Vincent Grenadines", shortName:"vc"},
    {name:"State of Palestine", shortName:"ps"},
    {name:"Sudan", shortName:"sd"},
    {name:"Suriname", shortName:"sr"},
    {name:"Sweden", shortName:"se"},
    {name:"Switzerland", shortName:"ch"},
    {name:"Syria", shortName:"sy"},
    {name:"Tajikistan", shortName:"tj"},
    {name:"Tanzania", shortName:"tz"},
    {name:"Thailand", shortName:"th"},
    {name:"Timor-Leste", shortName:"tl"},
    {name:"Togo", shortName:"tg"},
    {name:"Tonga", shortName:"to"},
    {name:"Trinidad and Tobago", shortName:"tt"},
    {name:"Tunisia", shortName:"tn"},
    {name:"Turkey", shortName:"tr"},
    {name:"Turkmenistan", shortName:"tm"},
    {name:"Tuvalu", shortName:"tv"},
    {name:"U.A.E.", shortName:"ae"},
    {name:"U.K.", shortName:"gb"},
    {name:"U.S.", shortName:"us"},
    {name:"Uganda", shortName:"ug"},
    {name:"Ukraine", shortName:"ua"},
    {name:"Uruguay", shortName:"uy"},
    {name:"Uzbekistan", shortName:"uz"},
    {name:"Vanuatu", shortName:"vu"},
    {name:"Venezuela", shortName:"ve"},
    {name:"Vietnam", shortName:"vn"},
    {name:"Yemen", shortName:"ye"},
    {name:"Zambia", shortName:"zm"},
    {name:"Zimbabwe", shortName:"zw"}
];

// ------------------------------------------------------------
// Register page controls
// ------------------------------------------------------------

function register() {

    var nextButton = document.getElementById("next");

    optA = document.getElementById("opt_a");
    optB = document.getElementById("opt_b");
    optC = document.getElementById("opt_c");
    optD = document.getElementById("opt_d");

    answerButtons = [
        optA,
        optB,
        optC,
        optD
    ];

    answerButtons.forEach(function(button, index) {

        button.addEventListener("click", function() {
            selectAnswer(index);
        });

    });

    nextButton.addEventListener("click", random, false);
}

// ------------------------------------------------------------
// Create a new question
// ------------------------------------------------------------

function random() {

    answerSubmitted = false;

    // Reset answer buttons
    answerButtons.forEach(function(button) {
        button.classList.remove("correct");
        button.classList.remove("wrong");
        button.classList.remove("reveal-correct");
        button.disabled = false;
    });

    // Clear result
    var result = document.getElementById("result");
    result.textContent = "";
    result.style.backgroundColor = "";

    // Pick four unique countries
    var choices = [];

    while (choices.length < 4) {

        var value = Math.floor(Math.random() * arrCountry.length);

        if (choices.indexOf(value) === -1) {
            choices.push(value);
        }
    }

    // Randomly determine which answer is correct
    correctAnswer = Math.floor(Math.random() * 4);

    // Set answer values and text
    for (var i = 0; i < 4; i++) {
        answerButtons[i].value = choices[i];
    }

    document.getElementById("option1").textContent =
        arrCountry[choices[0]].name;

    document.getElementById("option2").textContent =
        arrCountry[choices[1]].name;

    document.getElementById("option3").textContent =
        arrCountry[choices[2]].name;

    document.getElementById("option4").textContent =
        arrCountry[choices[3]].name;

    // The correct answer's country determines the flag
    var correctCountryIndex = choices[correctAnswer];

    var flag = document.getElementById("showFlag");

    flag.src =
        baseUrl +
        arrCountry[correctCountryIndex].shortName +
        appendUrl;

    flag.alt =
        arrCountry[correctCountryIndex].name + " flag";

    // Update attempts
    attemptTotal++;

    document.getElementById("totalCount").textContent =
        attemptTotal;
}

// ------------------------------------------------------------
// Determine answer when button is clicked
// ------------------------------------------------------------

function selectAnswer(index) {

    if (answerSubmitted) {
        return;
    }

    answerSubmitted = true;

    var result = document.getElementById("result");
    var clickedButton = answerButtons[index];

    if (index === correctAnswer) {

        // Correct answer
        clickedButton.classList.add("correct");

        result.textContent =
            "Correct Answer! You ROCK!";

        result.style.backgroundColor =
            "#008000";

        correctTotal++;

        document.getElementById("correctCount").textContent =
            correctTotal;

    }
    else {

        // Wrong answer
        clickedButton.classList.add("wrong");

        // Show correct answer
        answerButtons[correctAnswer].classList.add("reveal-correct");

        result.textContent =
            "Wrong Answer!";

        result.style.backgroundColor =
            "#FF0000";
    }

    // Prevent additional answers until Next Flag
    answerButtons.forEach(function(button) {
        button.disabled = true;
    });
}

// ------------------------------------------------------------
// Start application after page loads
// ------------------------------------------------------------

window.addEventListener("load", function() {
    register();
    random();
}, false);
