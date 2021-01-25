let debug = 1; // To be fixed in next release
const wipeTransitionTime = 1000*debug; // in milliseconds

function getNPSData(callback) {
    fetch('nps.json', {
    })
    .then( res => {return res.json()})
    .then( jsonRes => callback(jsonRes));

}

// This function was found on https://bost.ocks.org/mike/shuffle/
function generateRandomParkOrder(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
}

function renderQuestion(park, img) {

    document.querySelector('.park-name').innerHTML = park.name;
    document.querySelector('.park-img').src = img.src;
    document.querySelector('.park-description').innerHTML = park.description.replace(/Alabama|Alaska|American Samoa|Arizona|Arkansa|California|Colorado|Connecticut|Delaware|District of Columbia|Federated States of Micronesia|Florida|Georgia|Guam|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Marshall Islands|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Northern Mariana Islands|Ohio|Oklahoma|Oregon|Palau|Pennsylvania|Puerto Rico|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virgin Island|Virginia|Washington|West Virginia|Wisconsin|Wyoming/ig, '_____');


    return park.states;
    
}


function displayQuestion() {
    document.querySelector('.btn-next').classList.add('disabled');
    document.querySelector('.question-counter').innerHTML = parseInt(document.querySelector('.question-counter').innerHTML) + 1;

    document.querySelector('.answer-mask').style.width = 0;
    document.querySelector('.text-input').value = '';


    setTimeout( () => {
        document.querySelector('.answer-mask').style.zIndex = 5;
        document.querySelector('.question-mask').style.zIndex = 10;
        document.querySelector('.answer-mask').style.width = '100%';
        document.querySelector('.btn-submit').classList.remove('disabled');
    }, wipeTransitionTime)

    document.querySelector('.score').innerHTML = document.querySelector('.score').getAttribute('data-score');
}


function renderAnswer(correctAnswer, park) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    let correctStates = correctAnswer.split(',');

    if (correctAnswer.includes(userAnswer)) {
        console.log('yay!')
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        document.querySelector('.answer-container i').className = 'fas fa-check fa-9x';
        document.querySelector('.answer-container h1').innerHTML = '+1';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        document.querySelector('.score').setAttribute('data-score', parseInt(document.querySelector('.score').innerHTML) + 1)
        for (let i of correctStates) {
            console.log(i)
            states[i].numberOfParks++;
            states[i].correctParks++;
        }
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        document.querySelector('.answer-container i').className = 'fas fa-times fa-9x';
        document.querySelector('.answer-container h1').innerHTML = '';
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        for (let i of correctStates) {
            states[i].numberOfParks++;
        }
    }

 
    let stateNamesString = '';
    for (let i in correctStates) {
        if (i > 0) {
            stateNamesString += ', ';
        }
        stateNamesString += getStateFullName(correctStates[i]);
    }

    document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.name;
}

function displayAnswer() {
    document.querySelector('.question-mask').style.width = 0;
    document.querySelector('.btn-submit').classList.add('disabled');

    setTimeout( () => {
        document.querySelector('.question-mask').style.zIndex = 5;
        document.querySelector('.answer-mask').style.zIndex = 10;
        document.querySelector('.question-mask').classList.add('no-transitions');
        document.querySelector('.question-mask').style.width = '100%';
        setTimeout( () => {
            document.querySelector('.btn-next').classList.remove('disabled');
            document.querySelector('.question-mask').classList.remove('no-transitions');
        }, 10);
    }, wipeTransitionTime)
}


function menuPage() {
    document.querySelector('.card').innerHTML = renderMenuPage();

    document.querySelector('.status').classList.add('hidden');

    document.querySelector('.question-slider').addEventListener('input', () => {
        document.querySelector('.question-display').innerHTML = document.querySelector('.question-slider').value;
    })

    document.querySelector('.btn-start').addEventListener('click', () => {
        getNPSData( (res) => {
            gamePage(res.data, document.querySelector('.question-slider').value);
        })
    });
}

function gamePage(data, numberOfQuestions) {

    document.querySelector('.card').innerHTML = renderGamePage();

    document.querySelector('.status').classList.remove('hidden');

    // Reset states object in case user restarts game
    for (let i in states) {
        states[i].numberOfParks = 0;
        states[i].correctParks = 0;
    }

    let parks = [];
    for (let i in data) {
        if (data[i].designation.includes("National Park")) parks.push(data[i]); 
    }
    generateRandomParkOrder(parks);
    let parkIterator = 0;
    let img = new Image;
    img.src = parks[parkIterator].images[0].url;
    let correctAnswer = renderQuestion(parks[parkIterator], img);

    let randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
    img.src = parks[parkIterator + 1].images[randomIndex].url;


    document.querySelector('.question-counter').innerHTML = 1;
    document.querySelector('.question-total').innerHTML = numberOfQuestions;
    document.querySelector('.score').innerHTML = 0;


    document.querySelector('.fullscreen-container').addEventListener('click', toggleImgFullscreen);

    document.addEventListener('fullscreenchange', () => {
        document.querySelector('.park-img').classList.toggle('fullscreen');
    });

    function toggleImgFullscreen() {
        if (!document.fullscreenElement) {
            document.querySelector('.fullscreen-container').requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    document.addEventListener('keyup', keyboardHandler);

    document.querySelector('.btn-submit').addEventListener('click', () => {
        submitBtnHandler();
    });

    document.querySelector('.btn-submit').addEventListener('keypress', (e) => {
        e.preventDefault();
    });

    document.querySelector('.btn-next').addEventListener('click', () => {
        nextBtnHandler()
    })

    document.querySelector('.btn-next').addEventListener('keypress', (e) => {
        e.preventDefault();
    });

    function keyboardHandler(e) {
        if (e.key == 'Enter') {
            if (document.querySelector('.question-mask').style.zIndex == 10 && !document.querySelector('.btn-submit').classList.contains('disabled')) {
                // When question is displayed
                submitBtnHandler();
            } else  if (document.querySelector('.answer-mask').style.zIndex == 10 && !document.querySelector('.btn-next').classList.contains('disabled')) {
                // When answer is displayed
                nextBtnHandler();
            }
        }
    }

    function submitBtnHandler() {
        renderAnswer(correctAnswer, parks[parkIterator++]);
        displayAnswer();
        setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator], img)}, wipeTransitionTime );
    }

    function nextBtnHandler() {
        if (parkIterator < numberOfQuestions) {
            displayQuestion();
            // load next image
            randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
            img.src = parks[parkIterator + 1].images[randomIndex].url;
            console.log(parks[parkIterator + 1].fullName);
        } else {
            document.querySelector('.score').innerHTML = document.querySelector('.score').getAttribute('data-score');
            resultPage();
        }
    }

}

function resultPage() {
    document.querySelector('.card').innerHTML = renderResultsPage();

    document.querySelector('.btn-restart').addEventListener('click', () => {
        menuPage();
    })
}


menuPage();

states = {
    AZ: {numberOfParks: 0, correctParks:  0} ,
    AL: {numberOfParks: 0, correctParks:  0},
    AK: {numberOfParks: 0, correctParks:  0},
    AS: {numberOfParks: 0, correctParks:  0},
    AR: {numberOfParks: 0, correctParks:  0},
    CA: {numberOfParks: 0, correctParks:  0},
    CO: {numberOfParks: 0, correctParks:  0},
    CT: {numberOfParks: 0, correctParks:  0},
    DC: {numberOfParks: 0, correctParks:  0},
    DE: {numberOfParks: 0, correctParks:  0},
    FL: {numberOfParks: 0, correctParks:  0},
    GA: {numberOfParks: 0, correctParks:  0},
    HI: {numberOfParks: 0, correctParks:  0},
    ID: {numberOfParks: 0, correctParks:  0},
    IL: {numberOfParks: 0, correctParks:  0},
    IN: {numberOfParks: 0, correctParks:  0},
    IA: {numberOfParks: 0, correctParks:  0},
    KS: {numberOfParks: 0, correctParks:  0},
    KY: {numberOfParks: 0, correctParks:  0},
    LA: {numberOfParks: 0, correctParks:  0},
    ME: {numberOfParks: 0, correctParks:  0},
    MD: {numberOfParks: 0, correctParks:  0},
    MA: {numberOfParks: 0, correctParks:  0},
    MI: {numberOfParks: 0, correctParks:  0},
    MN: {numberOfParks: 0, correctParks:  0},
    MS: {numberOfParks: 0, correctParks:  0},
    MO: {numberOfParks: 0, correctParks:  0},
    MT: {numberOfParks: 0, correctParks:  0},
    NE: {numberOfParks: 0, correctParks:  0},
    NV: {numberOfParks: 0, correctParks:  0},
    NH: {numberOfParks: 0, correctParks:  0},
    NJ: {numberOfParks: 0, correctParks:  0},
    NM: {numberOfParks: 0, correctParks:  0},
    NY: {numberOfParks: 0, correctParks:  0},
    NC: {numberOfParks: 0, correctParks:  0},
    ND: {numberOfParks: 0, correctParks:  0},
    OH: {numberOfParks: 0, correctParks:  0},
    OK: {numberOfParks: 0, correctParks:  0},
    OR: {numberOfParks: 0, correctParks:  0},
    PA: {numberOfParks: 0, correctParks:  0},
    RI: {numberOfParks: 0, correctParks:  0},
    SC: {numberOfParks: 0, correctParks:  0},
    SD: {numberOfParks: 0, correctParks:  0},
    TN: {numberOfParks: 0, correctParks:  0},
    TX: {numberOfParks: 0, correctParks:  0},
    UT: {numberOfParks: 0, correctParks:  0},
    VT: {numberOfParks: 0, correctParks:  0},
    VI: {numberOfParks: 0, correctParks:  0},
    VA: {numberOfParks: 0, correctParks:  0},
    WA: {numberOfParks: 0, correctParks:  0},
    WV: {numberOfParks: 0, correctParks:  0},
    WI: {numberOfParks: 0, correctParks:  0},
    WY: {numberOfParks: 0, correctParks:  0} 
}