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

function getNextPark() {
     
}

function renderQuestion(park) {
   
    //let img = new Image;
    //img.addEventListener('load', () => {
        document.querySelector('.park-name').innerHTML = park.fullName.replace(/national|park/ig, '');
        document.querySelector('.park-img').src = park.img;
        document.querySelector('.park-description').innerHTML = park.description;
    //})
    //img.src = park.images[0].url;
    return park.states;
   // document.querySelector('.park-img').setAttribute('src', park.images[0].url);
    
}


function renderAnswer(correctAnswer) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    if (correctAnswer.includes(userAnswer)) {
        console.log('yay!')
        //document.querySelector('.question-container').style.left = '-1000px';
        document.querySelector('.answer-container i').className = 'far fa-check-square fa-9x green';
        document.querySelector('.answer-container h1').className = 'green';
        document.querySelector('.answer-container h1').innerHTML = '+100';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        document.querySelector('.answer-container').style.left = '0';
    } else {
        document.querySelector('.answer-container i').className = 'fas fa-times fa-9x red';
        document.querySelector('.answer-container h1').className = '';
        document.querySelector('.answer-container h1').innerHTML = '';
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        document.querySelector('.answer-container').style.left = '0';
    }

    return true;
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

    let img = new Image;
    let correctAnswer = '';

    img.addEventListener('load', () => {
        parks[parkIterator].img = img.src;
        correctAnswer = renderQuestion(parks[parkIterator++]);
    })
    img.src = parks[parkIterator].images[0].url;

    document.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            renderAnswer(correctAnswer);
            img.addEventListener('load', () => {
                parks[parkIterator].img = img.src;
            })
            img.src = parks[parkIterator].images[0].url;
        }
    })

    document.querySelector('.btn-submit').addEventListener('click', () => {
        if (renderAnswer(correctAnswer) && parkIterator < numberOfParks) {
            correctAnswer = renderQuestion(parks[parkIterator++]);
            console.log(correctAnswer)
        }
    });

    document.querySelector('.btn-next').addEventListener('click', () => {
        console.log('test')
        correctAnswer = renderQuestion(parks[parkIterator]);
    })

});
