const wipeTransitionTime = 1000;

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
        document.querySelector('.park-name').innerHTML = park.fullName.replace(/national|preserve|park/ig, '');
        document.querySelector('.park-img').src = img.src;
        document.querySelector('.park-description').innerHTML = park.description;
    })

    img.src = park.images[0].url;


    
    return park.states;
    
}


function displayQuestion() {
    document.querySelector('.answer-mask').style.width = 0;
    document.querySelector('.text-input').value = '';


    setTimeout( () => {
        document.querySelector('.answer-mask').style.zIndex = 5;
        document.querySelector('.question-mask').style.zIndex = 10;
        document.querySelector('.answer-mask').style.width = '100%';
        document.querySelector('.btn-submit').classList.remove('disabled');
    }, wipeTransitionTime)
}


function renderAnswer(correctAnswer) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    if (correctAnswer.includes(userAnswer)) {
        console.log('yay!')
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        document.querySelector('.answer-container i').className = 'far fa-check-square fa-9x';
        document.querySelector('.answer-container h1').className = '';
        document.querySelector('.answer-container h1').innerHTML = '+100';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        // document.querySelector('.answer-container').style.left = '0';
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        document.querySelector('.answer-container i').className = 'fas fa-times fa-9x';
        document.querySelector('.answer-container h1').className = '';
        document.querySelector('.answer-container h1').innerHTML = '';
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        // document.querySelector('.answer-container').style.left = '0';
    }

    return true;
}

function displayAnsewr() {
    document.querySelector('.question-mask').style.width = 0;
    document.querySelector('.btn-submit').classList.add('disabled');
    document.querySelector('.btn-next').classList.add('disabled');

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
    }

    let parkIterator = 0;
    const numberOfParks = parks.length;
    generateRandomParkOrder(parks);
     
    let correctAnswer = renderQuestion(parks[parkIterator++]);


    document.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            renderAnswer(correctAnswer);
            displayAnsewr();
            setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator++])}, wipeTransitionTime );
        }
    })

    document.querySelector('.btn-submit').addEventListener('click', (e) => {
        renderAnswer(correctAnswer);
        displayAnsewr();
        setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator++])}, wipeTransitionTime );
    });

    document.querySelector('.btn-next').addEventListener('click', () => {
        displayQuestion();
    })

});
