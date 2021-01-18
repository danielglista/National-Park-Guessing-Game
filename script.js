let parks = [];

function getNPSData(callback) {
    fetch('https://developer.nps.gov/api/v1/parks?limit=468', {
        method: 'GET',
        headers: {
            'x-api-key': 'b0CyU5w8dbQg3kx1IPbQA2IaDt17EeLvIkcHbdCj'
        }
    })
    .then( res => res.json())
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

}

getNPSData( (jsonRes) => {
    const data = jsonRes.data;
    for (let i in data) {
        if (data[i].designation == "National Park")
            parks.push(data[i]);
    }
    generateRandomParkOrder(parks);
    renderQuestion(parkData);
});
