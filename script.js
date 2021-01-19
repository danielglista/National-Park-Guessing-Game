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
    document.querySelector('.park-name').innerHTML = park.fullName.replace(/national|park/ig, '');
    document.querySelector('.park-img').setAttribute('src', park.images[0].url);
    document.querySelector('.park-description').innerHTML = park.description;
    return park.states;
}


function renderAnswer(correctAnswer) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    if (correctAnswer.includes(userAnswer)) {
        console.log('yay!')
        document.querySelector('.question-container').style.left = '-1000px';
    }
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
    let correctAnswer = renderQuestion(parks[parkIterator]);

    document.querySelector('.btn-submit').addEventListener('click', () => {renderAnswer(correctAnswer)});

});
