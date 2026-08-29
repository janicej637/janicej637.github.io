// Assignment 3
// Author: Janice James

// Declare Application Variables 
var checkFlag; 									// Reports if no option is selected
var attemptTotal = -1; 							// Keeps track of total attempts
var correctTotal = 0; 							// Keeps track of correct answers
var clickCounter = 0; 							// Keeps track of Submit clicks
var correctAnswer = 0; 							// Position of correct answer
var optA, optB, optC, optD; 					// Option variables for each radio button
var arrRadios = new Array(); 					// Create array of radio options
var arrCountry = new Array(); 					// Create array of countries
var radio; 	// Radio buttons group

// Create URL base and append variables
var baseUrl = 'https://www.worldometers.info/images/flags/original/';
var appendUrl = '.webp';


// Populate arrCountry with Country Names and Abbreviations
arrCountry[0]={name:"Afghanistan", shortName:"af"};                                                   
arrCountry[1]={name:"Albania", shortName:"al"};                                                   
arrCountry[2]={name:"Algeria", shortName:"dz"};                                                   
arrCountry[3]={name:"Andorra", shortName:"ao"};                                                   
arrCountry[4]={name:"Angola", shortName:"ag"};                                                   
arrCountry[5]={name:"Antigua and Barbuda", shortName:"ag"};                                                   
arrCountry[6]={name:"Argentina", shortName:"ar"};                                                   
arrCountry[7]={name:"Armenia", shortName:"am"};                                                   
arrCountry[8]={name:"Australia", shortName:"au"};                                                   
arrCountry[9]={name:"Austria", shortName:"at"};                                                   
arrCountry[10]={name:"Azerbaijan", shortName:"az"}; 
arrCountry[11]={name:"Bahamas", shortName:"bs"};                                                   
arrCountry[12]={name:"Bahrain", shortName:"bh"};                                                   
arrCountry[13]={name:"Bangladesh", shortName:"bd"}; 
arrCountry[14]={name:"Barbados", shortName:"bb"};
arrCountry[15]={name:"Belarus", shortName:"by"};
arrCountry[16]={name:"Belgium", shortName:"be"};
arrCountry[17]={name:"Belize", shortName:"bz"};
arrCountry[18]={name:"Benin", shortName:"bj"};
arrCountry[19]={name:"Bhutan", shortName:"bt"};                                                  
arrCountry[20]={name:"Bolivia", shortName:"bo"};
arrCountry[21]={name:"Bosnia and Herzegovina", shortName:"ba"};
arrCountry[22]={name:"Botswana", shortName:"bw"};
arrCountry[23]={name:"Brazil", shortName:"br"}; 
arrCountry[24]={name:"Brunei ", shortName:"bn"};
arrCountry[25]={name:"Bulgaria", shortName:"bg"}; 
arrCountry[26]={name:"Burkina Faso", shortName:"bf"};
arrCountry[27]={name:"Burundi", shortName:"bi"};
arrCountry[28]={name:"Cabo Verde", shortName:"cv"}; 
arrCountry[29]={name:"Cambodia", shortName:"kh"};
arrCountry[30]={name:"Cameroon", shortName:"cm"};
arrCountry[31]={name:"Canada", shortName:"ca"};
arrCountry[32]={name:"Central African Republic", shortName:"cf"};
arrCountry[33]={name:"Chad", shortName:"td"};
arrCountry[34]={name:"Chile", shortName:"cl"};
arrCountry[35]={name:"China", shortName:"cn"};
arrCountry[36]={name:"Colombia", shortName:"co"};
arrCountry[37]={name:"Comoros", shortName:"km"}; 
arrCountry[38]={name:"Congo", shortName:"cg"};
arrCountry[39]={name:"Costa Rica", shortName:"cr"};
arrCountry[40]={name:"Côte d'Ivoire", shortName:"ci"}; 
arrCountry[41]={name:"Croatia", shortName:"hr"}; 
arrCountry[42]={name:"Cuba", shortName:"cu"};
arrCountry[43]={name:"Cyprus", shortName:"cy"};
arrCountry[44]={name:"Czechia", shortName:"cz"};
arrCountry[45]={name:"Denmark", shortName:"dk"};
arrCountry[46]={name:"Djibouti", shortName:"dj"};
arrCountry[47]={name:"Dominica", shortName:"dm"};
arrCountry[48]={name:"Dominican Republic", shortName:"do"};
arrCountry[49]={name:"Democratic People's Republic of Korea", shortName:"kp"};
arrCountry[50]={name:"DR Congo", shortName:"cd"};
arrCountry[51]={name:"Ecuador", shortName:"ec"};
arrCountry[52]={name:"Egypt", shortName:"eg"};
arrCountry[53]={name:"El Salvador", shortName:"sv"}; 
arrCountry[54]={name:"Equatorial Guinea", shortName:"gq"};
arrCountry[55]={name:"Eritrea", shortName:"er"};
arrCountry[56]={name:"Estonia", shortName:"ee"}; 
arrCountry[57]={name:"Eswatini", shortName:"sz"};
arrCountry[58]={name:"Ethiopia", shortName:"et"};
arrCountry[59]={name:"Fiji", shortName:"fj"};
arrCountry[60]={name:"Finland", shortName:"fi"};
arrCountry[61]={name:"France", shortName:"fr"};
arrCountry[62]={name:"Gabon", shortName:"ga"};
arrCountry[63]={name:"Gambia", shortName:"gm"};
arrCountry[64]={name:"Georgia", shortName:"ge"};
arrCountry[65]={name:"Germany", shortName:"de"};
arrCountry[66]={name:"Ghana", shortName:"gh"}; 
arrCountry[67]={name:"Greece", shortName:"gr"};
arrCountry[68]={name:"Grenada", shortName:"gd"}; 
arrCountry[69]={name:"Guatemala", shortName:"gt"}; 
arrCountry[70]={name:"Guinea", shortName:"gn"}; 
arrCountry[71]={name:"Guinea-Bissau", shortName:"gw"};
arrCountry[72]={name:"Guyana", shortName:"gy"};
arrCountry[73]={name:"Haiti", shortName:"ht"}; 
arrCountry[74]={name:"Holy See", shortName:"va"};
arrCountry[75]={name:"Honduras", shortName:"hn"};
arrCountry[76]={name:"Hungary", shortName:"hu"};
arrCountry[77]={name:"Iceland", shortName:"is"}; 
arrCountry[78]={name:"India", shortName:"in"};
arrCountry[79]={name:"Indonesia", shortName:"id"}; 
arrCountry[80]={name:"Iran", shortName:"ir"};
arrCountry[81]={name:"Iraq", shortName:"iq"};
arrCountry[82]={name:"Ireland", shortName:"ie"};
arrCountry[83]={name:"Israel", shortName:"il"};
arrCountry[84]={name:"Italy", shortName:"it"};
arrCountry[85]={name:"Jamaica", shortName:"jm"};
arrCountry[86]={name:"Japan", shortName:"jp"};
arrCountry[87]={name:"Jordan", shortName:"jo"};
arrCountry[88]={name:"Kazakhstan", shortName:"kz"};
arrCountry[89]={name:"Kenya", shortName:"ke"};
arrCountry[90]={name:"Kiribati", shortName:"ki"};
arrCountry[91]={name:"Kuwait", shortName:"kw"};
arrCountry[92]={name:"Kyrgyzstan", shortName:"kg"};
arrCountry[93]={name:"Laos", shortName:"la"};
arrCountry[94]={name:"Latvia", shortName:"lv"};
arrCountry[95]={name:"Lebanon", shortName:"lb"};
arrCountry[96]={name:"Lesotho", shortName:"ls"};
arrCountry[97]={name:"Liberia", shortName:"lr"};
arrCountry[98]={name:"Libya", shortName:"ly"};
arrCountry[99]={name:"Liechtenstein", shortName:"li"};
arrCountry[100]={name:"Lithuania", shortName:"lt"};
arrCountry[101]={name:"Luxembourg", shortName:"lu"};
arrCountry[102]={name:"Madagascar", shortName:"mg"};
arrCountry[103]={name:"Malawi", shortName:"mw"};
arrCountry[104]={name:"Malaysia", shortName:"my"};
arrCountry[105]={name:"Maldives", shortName:"mv"};
arrCountry[106]={name:"Mali", shortName:"ml"};
arrCountry[107]={name:"Malta", shortName:"mt"};
arrCountry[108]={name:"Marshall Islands", shortName:"mh"};
arrCountry[109]={name:"Mauritania", shortName:"mr"};
arrCountry[110]={name:"Mauritius", shortName:"mu"};
arrCountry[111]={name:"Mexico", shortName:"mx"};
arrCountry[112]={name:"Micronesia", shortName:"fm"};
arrCountry[113]={name:"Moldova", shortName:"md"};
arrCountry[114]={name:"Monaco", shortName:"mc"};
arrCountry[115]={name:"Mongolia", shortName:"mn"};
arrCountry[116]={name:"Montenegro", shortName:"me"};
arrCountry[117]={name:"Morocco", shortName:"ma"};
arrCountry[118]={name:"Mozambique", shortName:"mz"};
arrCountry[119]={name:"Myanmar", shortName:"mm"};
arrCountry[120]={name:"Namibia", shortName:"na"};
arrCountry[121]={name:"Nauru", shortName:"nr"};
arrCountry[122]={name:"Nepal", shortName:"np"};
arrCountry[123]={name:"Netherlands", shortName:"nl"};
arrCountry[124]={name:"New Zealand", shortName:"nz"};
arrCountry[125]={name:"Nicaragua", shortName:"ni"};
arrCountry[126]={name:"Niger", shortName:"ne"};
arrCountry[127]={name:"Nigeria", shortName:"ng"};
arrCountry[128]={name:"North Macedonia", shortName:"mk"};
arrCountry[129]={name:"Norway", shortName:"no"};
arrCountry[130]={name:"Oman", shortName:"om"};
arrCountry[131]={name:"Pakistan", shortName:"pk"};
arrCountry[132]={name:"Palau", shortName:"pw"};
arrCountry[133]={name:"Panama", shortName:"pa"};
arrCountry[134]={name:"Papua New Guinea", shortName:"pg"};
arrCountry[135]={name:"Paraguay", shortName:"py"};
arrCountry[136]={name:"Peru", shortName:"pe"};
arrCountry[137]={name:"Philippines", shortName:"ph"};
arrCountry[138]={name:"Poland", shortName:"pl"};
arrCountry[139]={name:"Portugal", shortName:"pt"};
arrCountry[140]={name:"Qatar", shortName:"qa"};
arrCountry[141]={name:"Romania", shortName:"ro"};
arrCountry[142]={name:"Russia", shortName:"ru"};
arrCountry[143]={name:"Rwanda", shortName:"rw"};
arrCountry[144]={name:"Saint Kitts and Nevis", shortName:"kn"};
arrCountry[145]={name:"Saint Lucia", shortName:"lc"};
arrCountry[146]={name:"Samoa", shortName:"ws"};
arrCountry[147]={name:"San Marino", shortName:"sm"};
arrCountry[148]={name:"Sao Tome and Principe", shortName:"st"};
arrCountry[149]={name:"Saudi Arabia", shortName:"sa"};
arrCountry[150]={name:"Senegal", shortName:"sn"};
arrCountry[151]={name:"Serbia", shortName:"rs"};
arrCountry[152]={name:"Seychelles", shortName:"sc"};
arrCountry[153]={name:"Sierra Leone", shortName:"sl"};
arrCountry[154]={name:"Singapore", shortName:"sg"};
arrCountry[155]={name:"Slovakia", shortName:"sk"};
arrCountry[156]={name:"Slovenia", shortName:"si"};
arrCountry[157]={name:"Solomon Islands", shortName:"sb"};
arrCountry[158]={name:"Somalia", shortName:"so"};
arrCountry[159]={name:"South Africa", shortName:"za"};
arrCountry[160]={name:"South Korea", shortName:"kr"};
arrCountry[161]={name:"South Sudan", shortName:"ss"};
arrCountry[162]={name:"Spain", shortName:"es"};
arrCountry[163]={name:"Sri Lanka", shortName:"lk"};
arrCountry[164]={name:"St. Vincent Grenadines", shortName:"vc"};
arrCountry[165]={name:"State of Palestine", shortName:"ps"};
arrCountry[166]={name:"Sudan", shortName:"sd"};
arrCountry[167]={name:"Suriname", shortName:"sr"};
arrCountry[168]={name:"Sweden", shortName:"se"};
arrCountry[169]={name:"Switzerland", shortName:"ch"};
arrCountry[170]={name:"Syria", shortName:"sy"};
arrCountry[171]={name:"Tajikistan", shortName:"tj"};
arrCountry[172]={name:"Tanzania", shortName:"tz"};
arrCountry[173]={name:"Thailand", shortName:"th"};
arrCountry[174]={name:"Timor-Leste", shortName:"tl"};
arrCountry[175]={name:"Togo", shortName:"tg"};
arrCountry[176]={name:"Tonga", shortName:"to"};
arrCountry[177]={name:"Trinidad and Tobago", shortName:"tt"};
arrCountry[178]={name:"Tunisia", shortName:"tn"};
arrCountry[179]={name:"Turkey", shortName:"tr"};
arrCountry[180]={name:"Turkmenistan", shortName:"tm"};
arrCountry[181]={name:"Tuvalu", shortName:"tv"};
arrCountry[182]={name:"U.A.E.", shortName:"ae"};
arrCountry[183]={name:"U.K.", shortName:"gb"};
arrCountry[184]={name:"U.S.", shortName:"us"};
arrCountry[185]={name:"Uganda", shortName:"ug"};
arrCountry[186]={name:"Ukraine", shortName:"ua"};
arrCountry[187]={name:"Uruguay", shortName:"uy"};
arrCountry[188]={name:"Uzbekistan", shortName:"uz"};
arrCountry[189]={name:"Vanuatu", shortName:"vu"};
arrCountry[190]={name:"Venezuela", shortName:"ve"};
arrCountry[191]={name:"Vietnam", shortName:"vn"};
arrCountry[192]={name:"Yemen", shortName:"ye"};
arrCountry[193]={name:"Zambia", shortName:"zm"};
arrCountry[194]={name:"Zimbabwe", shortName:"zw"};




// Register button listeners and get the option elements
function register(){

	var button = document.getElementById("next");
	button.addEventListener("click", random, false);
	var button1 = document.getElementById("submit");
	button1.addEventListener("click", checkCorrect, false);
	
   radio = document.getElementsByName('rad');
	

	optA = document.getElementById("opt_a");
	optB= document.getElementById("opt_b");
	optC = document.getElementById("opt_c");
	optD = document.getElementById("opt_d");

 
	
} // end function 



// Randomly Set Up New Quiz
function random(){

	// Reset clickCounter
	clickCounter = 0;

	// Uncheck all radio buttons and remove highlight from label in previous quiz
	for(var i = 0; i < radio.length; i++){
		radio[i].checked = false;
		document.getElementById("opt_" + radio[i].id).setAttribute('style', 'background-color: none');
	}

	// Randomly Set A & B Options
	setRandom(optA);
	setRandom(optB);

	// Test for Duplicates
	while(optB.getAttribute('value') == optA.getAttribute('value')){
		setRandom(optB);
	}

	// Randomly Set C Option
	setRandom(optC);

	// Test for Duplicates
	while(optC.getAttribute('value') == optA.getAttribute('value') || optC.getAttribute('value') == optB.getAttribute('value')){
		setRandom(optC);
	}

	// Randomly Set D Option
	setRandom(optD);

	// Test for Duplicates
	while(optD.getAttribute('value') == optA.getAttribute('value') || optD.getAttribute('value') == optB.getAttribute('value')|| optD.getAttribute('value') == optC.getAttribute('value')){
		setRandom(optD);
	}


	// Populate arrRadios with the value of each radio button and set all checks to false
	arrRadios[0]={value: optA.getAttribute('value'), correct: false};
	arrRadios[1]={value: optB.getAttribute('value'), correct: false};
	arrRadios[2]={value: optC.getAttribute('value'), correct: false};
	arrRadios[3]={value: optD.getAttribute('value'), correct: false};

	// Randomly select position of the correct answer
	correctAnswer = Math.floor( 0 + Math.random() * 4); 

	// Set position of correct answer check to true
	arrRadios[correctAnswer].correct = true;

	// Set Flag Image with Correct Answer
	document.getElementById("showFlag").setAttribute("src",baseUrl + arrCountry[arrRadios[correctAnswer].value].shortName + appendUrl);

	// Update Total Attempts on Score Card 
	attemptTotal = attemptTotal + 1;
	document.getElementById("totalCount").innerHTML = attemptTotal;
	
// Update correctTotal on Score Card 
	document.getElementById("correctCount").innerHTML =correctTotal;	

	// Clear Result Banner
	document.getElementById("result").innerHTML = '';
	document.getElementById("result").setAttribute('style', 'background-color: none');

	   // Make clicking the country name select the radio button
    optA.onclick = function () {
        document.getElementById("a").checked = true;
    };

    optB.onclick = function () {
        document.getElementById("b").checked = true;
    };

    optC.onclick = function () {
        document.getElementById("c").checked = true;
    };

    optD.onclick = function () {
       document.getElementById("d").checked = true;
    };
	
}// end function 


// Randomly set options
function setRandom(choice){
	var optValue = Math.floor( 0 + Math.random() * 80); 
	choice.innerHTML = arrCountry[optValue].name; 	// Set label for radio button
	choice.setAttribute('value',optValue); 			// Set value
}// end function 


// Check if user selected the correct answer
function checkCorrect(){
	clickCounter = clickCounter + 1; 
	checkFlag = true;

	if(clickCounter < 2){

		for(var i = 0; i < radio.length; i++){

			// If Wrong Answer
			if(radio[i].checked && arrRadios[i].correct == false){

				// Show Red Result Banner 
				document.getElementById("result").setAttribute('style', 'background-color: #FF0000');
				document.getElementById("result").innerHTML = 'Wrong Answer! Try another flag.';

				// Highlight Correct Answer Green
				document.getElementById("opt_" + radio[correctAnswer].id).setAttribute('style', 'background-color: #008000');
				checkFlag = false;
			}

			// If Correct Answer
			if(radio[i].checked && arrRadios[i].correct){

				// Show Green Result Banner
				document.getElementById("result").setAttribute('style', 'background-color: #008000'); 
				document.getElementById("result").innerHTML = 'Correct Answer! You ROCK!';

				// Highlight Correct Answer Green
				document.getElementById("opt_" + radio[correctAnswer].id).setAttribute('style', 'background-color: #008000');

				// Update Correct Answers on Score Card 
				correctTotal = correctTotal + 1;
				document.getElementById("correctCount").innerHTML =correctTotal;		
				
				checkFlag = false;
			}

			// If No Answer/Training Session
			if(checkFlag){

				// Show Blue Result Banner
				document.getElementById("result").innerHTML = 'Training Session';
				document.getElementById("result").setAttribute('style', 'background-color: #0000A0');

				// Highlight Correct Answer Blue
				document.getElementById("opt_" + radio[correctAnswer].id).setAttribute('style', 'background-color: #0000A0');
			}
		}
	}
	else{

		// If user clicked Submit more than once
		document.getElementById("result").innerHTML = 'Click Next Flag to Continue';
		document.getElementById("result").setAttribute('style', 'background-color: #0000A0');
	}
}// end function
//window.addEventListener("load", register, false);
// window.addEventListener("load", random, false);


window.addEventListener("load", function () {
    register();
    random();
}, false);



