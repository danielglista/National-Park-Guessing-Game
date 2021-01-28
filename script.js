let debug = 0.8; // To be fixed in next release
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

function renderQuestion(park, img, hint=0) {

    document.querySelector('.park-name').innerHTML = '???'
    document.querySelector('.park-description').innerHTML = '???????????????????????????'
    document.querySelector('.park-description').classList.add('text-center');


    if (hint == 0) {
        document.querySelector('.park-img').src = img.src;
    }
    if (hint > 0) {
        document.querySelector('.park-description').classList.remove('text-center');
        document.querySelector('.park-description').innerHTML = park.description.replaceAll(/Alabama|Alaska|American Samoa|Arizona|Arkansa|California|Colorado|Connecticut|Delaware|District of Columbia|Federated States of Micronesia|Florida|Georgia|Guam|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Marshall Islands|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Northern Mariana Islands|Ohio|Oklahoma|Oregon|Palau|Pennsylvania|Puerto Rico|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virgin Island|Virginia|Washington|West Virginia|Wisconsin|Wyoming/ig, '_____');  
        document.querySelector('.park-description').innerHTML = document.querySelector('.park-description').innerHTML.replaceAll(park.name, '<span class="green">_____</span>');    
    }
    if (hint > 1) {
        document.querySelector('.park-name').innerHTML = park.name;
        document.querySelector('.park-description').innerHTML = document.querySelector('.park-description').innerHTML.replaceAll('<span class="green">_____</span>', `<span class="green">${park.name}</span>`); 
    }

    return park.states;
    
}


function displayQuestion() {
    document.querySelector('.btn-next').classList.add('disabled');
    document.querySelector('.btn-next').blur();
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

function lonLatToXY(longitude, latitude) {
    let west = -124.73;
    let east = -66.57;
    let width = 1452;
    longitude = -68.247501;
    console.log((width) * Math.abs(longitude - west) / Math.abs(west - east))
    // let x = ((longitude - east) / (west - east)) * width;
    x = (width) * (longitude - west) / Math.abs(west - east);
    return [x, 300];
}

function renderAnswer(correctAnswer, park) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    let correctStates = correctAnswer.split(',');

    if (correctAnswer.includes(userAnswer)) {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        document.querySelector('.answer-container i').className = 'fas fa-check fa-9x';
        document.querySelector('.answer-container h1').innerHTML = '+1';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        document.querySelector('.score').setAttribute('data-score', parseInt(document.querySelector('.score').innerHTML) + 1)
        for (let i of correctStates) {
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

    //states[correctStates[0]].parks.push(parkLocations['Lake Clark']);

    let cord = lonLatToXY(0, 0);
    document.querySelector('svg').innerHTML += `<circle cx='${cord[0]}px' cy='50%' r='10' stroke='green' stroke-width='5' fill='none' fill-opacity='0.01' </circle>`


}

function displayAnswer() {
    document.querySelector('.question-mask').style.width = 0;
    document.querySelector('.btn-submit').classList.add('disabled');
    document.querySelector('.btn-submit').blur();

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
    let randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator].images).length);
    img.src = parks[parkIterator].images[randomIndex].url;
    let correctAnswer = renderQuestion(parks[parkIterator], img);
    let hint = 0;

    randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
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

    document.querySelector('.btn-hint').addEventListener('click', hintHander);

    let svgImage = document.querySelector('svg');
    let svgContainer = document.querySelector('.svg-container');


    var viewBox = {x:0,y:0,w:svgImage.clientWidth,h:svgImage.clientHeight};
    svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    const svgSize = {w:svgImage.clientWidth,h:svgImage.clientHeight};
    var isPanning = false;
    var startPoint = {x:0,y:0};
    var endPoint = {x:0,y:0};;
    var scale = 1;
    let lastTouch = {x:0,y:0};

    document.querySelector('.svg-container').onwheel = function(e) {
        e.preventDefault();
        var w = viewBox.w;
        var h = viewBox.h;
        var mx = e.offsetX;//mouse x  
        var my = e.offsetY;    
        var dw = w*Math.sign(-e.deltaY)*0.04;
        var dh = h*Math.sign(-e.deltaY)*0.04;
        var dx = dw*mx/svgSize.w;
        var dy = dh*my/svgSize.h;
        viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
        scale = svgSize.w/viewBox.w;
        svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    

    svgContainer.onmousedown = function(e){
        isPanning = true;
        startPoint = {x:e.x,y:e.y};   
    }

    svgContainer.ontouchstart = function(e){
        isPanning = true;
        startPoint = {x:e.touches[0].screenX,y:e.touches[0].screenY};   
    }
    
    svgContainer.onmousemove = function(e){
        if (isPanning){
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
    }

    svgContainer.ontouchmove = function(e){
        if (isPanning){
            endPoint = {x:e.touches[0].screenX,y:e.touches[0].screenY};
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
    }
    
    svgContainer.onmouseup = function(e){
        if (isPanning){ 
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    }

    svgContainer.ontouchend = function(e){
        if (isPanning){ 
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    }
    
        svgContainer.onmouseleave = function(e){
        isPanning = false;
    }

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
        hint = 0;
        document.querySelector('.btn-hint').classList.remove('disabled');
        setTimeout(() => {correctAnswer = renderQuestion(parks[parkIterator], img)}, wipeTransitionTime );
    }

    function nextBtnHandler() {
        if (parkIterator < numberOfQuestions) {
            displayQuestion();
            // load next image
            randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
            img.src = parks[parkIterator + 1].images[randomIndex].url;
        } else {
            document.querySelector('.score').innerHTML = document.querySelector('.score').getAttribute('data-score');
            resultPage();
        }
    }

    function hintHander() {
        renderQuestion(parks[parkIterator], img, ++hint);
        if (hint > 1) {
            document.querySelector('.btn-hint').classList.add('disabled');
            document.querySelector('.btn-hint').blur();
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
    AZ: {numberOfParks: 0, correctParks: 0, parks: {}},
    AL: {numberOfParks: 0, correctParks: 0, parks: {}},
    AK: {numberOfParks: 0, correctParks: 0, parks: {}},
    AS: {numberOfParks: 0, correctParks: 0, parks: {}},
    AR: {numberOfParks: 0, correctParks: 0, parks: {}},
    CA: {numberOfParks: 0, correctParks: 0, parks: {}},
    CO: {numberOfParks: 0, correctParks: 0, parks: {}},
    CT: {numberOfParks: 0, correctParks: 0, parks: {}},
    DC: {numberOfParks: 0, correctParks: 0, parks: {}},
    DE: {numberOfParks: 0, correctParks: 0, parks: {}},
    FL: {numberOfParks: 0, correctParks: 0, parks: {}},
    GA: {numberOfParks: 0, correctParks: 0, parks: {}},
    HI: {numberOfParks: 0, correctParks: 0, parks: {}},
    ID: {numberOfParks: 0, correctParks: 0, parks: {}},
    IL: {numberOfParks: 0, correctParks: 0, parks: {}},
    IN: {numberOfParks: 0, correctParks: 0, parks: {}},
    IA: {numberOfParks: 0, correctParks: 0, parks: {}},
    KS: {numberOfParks: 0, correctParks: 0, parks: {}},
    KY: {numberOfParks: 0, correctParks: 0, parks: {}},
    LA: {numberOfParks: 0, correctParks: 0, parks: {}},
    ME: {numberOfParks: 0, correctParks: 0, parks: {}},
    MD: {numberOfParks: 0, correctParks: 0, parks: {}},
    MA: {numberOfParks: 0, correctParks: 0, parks: {}},
    MI: {numberOfParks: 0, correctParks: 0, parks: {}},
    MN: {numberOfParks: 0, correctParks: 0, parks: {}},
    MS: {numberOfParks: 0, correctParks: 0, parks: {}},
    MO: {numberOfParks: 0, correctParks: 0, parks: {}},
    MT: {numberOfParks: 0, correctParks: 0, parks: {}},
    NE: {numberOfParks: 0, correctParks: 0, parks: {}},
    NV: {numberOfParks: 0, correctParks: 0, parks: {}},
    NH: {numberOfParks: 0, correctParks: 0, parks: {}},
    NJ: {numberOfParks: 0, correctParks: 0, parks: {}},
    NM: {numberOfParks: 0, correctParks: 0, parks: {}},
    NY: {numberOfParks: 0, correctParks: 0, parks: {}},
    NC: {numberOfParks: 0, correctParks: 0, parks: {}},
    ND: {numberOfParks: 0, correctParks: 0, parks: {}},
    OH: {numberOfParks: 0, correctParks: 0, parks: {}},
    OK: {numberOfParks: 0, correctParks: 0, parks: {}},
    OR: {numberOfParks: 0, correctParks: 0, parks: {}},
    PA: {numberOfParks: 0, correctParks: 0, parks: {}},
    RI: {numberOfParks: 0, correctParks: 0, parks: {}},
    SC: {numberOfParks: 0, correctParks: 0, parks: {}},
    SD: {numberOfParks: 0, correctParks: 0, parks: {}},
    TN: {numberOfParks: 0, correctParks: 0, parks: {}},
    TX: {numberOfParks: 0, correctParks: 0, parks: {}},
    UT: {numberOfParks: 0, correctParks: 0, parks: {}},
    VT: {numberOfParks: 0, correctParks: 0, parks: {}},
    VI: {numberOfParks: 0, correctParks: 0, parks: {}},
    VA: {numberOfParks: 0, correctParks: 0, parks: {}},
    WA: {numberOfParks: 0, correctParks: 0, parks: {}},
    WV: {numberOfParks: 0, correctParks: 0, parks: {}},
    WI: {numberOfParks: 0, correctParks: 0, parks: {}},
    WY: {numberOfParks: 0, correctParks: 0, parks: {}} 
}

