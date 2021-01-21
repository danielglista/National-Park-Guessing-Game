const wipeTransitionTime = 1000; // in milliseconds

function getNPSData(callback) {
    fetch('https://developer.nps.gov/api/v1/parks?limit=500', {
        method: 'GET',
        headers: {
            'x-api-key': 'b0CyU5w8dbQg3kx1IPbQA2IaDt17EeLvIkcHbdCj'
        }
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


function renderQuestion(park) {

    let img = new Image;

    img.addEventListener('load', () => {
        document.querySelector('.park-name').innerHTML = park.fullName.replace(/\b(national+.*of|national|preserve|park|parks|state|and)\b/ig, '')
        .replace(/&/, '')
        .replace(/(river.*)(river)/ig, '$1');
        document.querySelector('.park-img').src = img.src;
        document.querySelector('.park-description').innerHTML = park.description;
    })

    img.src = park.images[0].url;


    
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
    if (correctAnswer.includes(userAnswer)) {
        console.log('yay!')
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        document.querySelector('.answer-container i').className = 'far fa-check-square fa-9x';
        document.querySelector('.answer-container h1').innerHTML = '+1';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        document.querySelector('.score').setAttribute('data-score', parseInt(document.querySelector('.score').innerHTML) + 1)
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        document.querySelector('.answer-container i').className = 'fas fa-times fa-9x';
        document.querySelector('.answer-container h1').innerHTML = '';
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
    }

    let correctStates = correctAnswer.split(',');
    let stateNamesString = '';
    for (let i in correctStates) {
        if (i > 0) {
            stateNamesString += ', ';
        }
        stateNamesString += getStateFullName(correctStates[i]);
    }
    //document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.fullName.replace(/national|preserve|park/ig, '');
    document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.fullName.replace(/\b(national+.*of|national|preserve|park|parks|state|and)\b/ig, '')
    .replace(/&/, '')
    .replace(/(river.*)(river)/ig, '$1');
}

function displayAnsewr() {
    document.querySelector('.question-mask').style.width = 0;
    document.querySelector('.btn-submit').classList.add('disabled');

    setTimeout( () => {
        document.querySelector('.question-mask').style.zIndex = 5;
        document.querySelector('.answer-mask').style.zIndex = 10;
        document.querySelector('.question-mask').classList.add('no-transitions');
        setTimeout( () => {
            document.querySelector('.question-mask').style.width = '100%';
            setTimeout( () => {
                document.querySelector('.btn-next').classList.remove('disabled');
                document.querySelector('.question-mask').classList.remove('no-transitions');
            }, 0);
 
        }, 0)
    }, wipeTransitionTime)
}

getNPSData( (jsonRes) => {
    const data = jsonRes.data;
    let parks = [];

    for (let i in data) {
        if (data[i].designation.includes("National Park")) parks.push(data[i]);  
        // Manually adding American Samoa, Redwood, and New River because the NPS API is inconsistant with its categorization
        if (data[i].fullName == 'National Park of American Samoa' || data[i].fullName == 'Redwood National and State Parks' || data[i].fullName == 'New River Gorge National River') parks.push(data[i]);
    }

    let parkIterator = 0;
    const numberOfParks = parks.length;
    document.querySelector('.question-total').innerHTML = numberOfParks;

    generateRandomParkOrder(parks);
     
    let correctAnswer = renderQuestion(parks[parkIterator]);


    document.addEventListener('keyup', (e) => {
        if (e.key == 'Enter') {
            if (document.querySelector('.question-mask').style.zIndex == 10 && !document.querySelector('.btn-submit').classList.contains('disabled')) {
                renderAnswer(correctAnswer, parks[parkIterator++]);
                displayAnsewr();
                setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator])}, wipeTransitionTime );
            } else  if (document.querySelector('.answer-mask').style.zIndex == 10 && !document.querySelector('.btn-next').classList.contains('disabled')) {
                displayQuestion();
            }
        }
    })

    document.querySelector('.btn-submit').addEventListener('click', (e) => {
        renderAnswer(correctAnswer, parks[parkIterator++]);
        displayAnsewr();
        setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator])}, wipeTransitionTime );
    });

    document.querySelector('.btn-next').addEventListener('click', () => {
        displayQuestion();
    })

});
