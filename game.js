let debug = 0.8; // To be fixed in next release
const wipeTransitionTime = 1000*debug; // in milliseconds
let viewBox = {x:593,y:861,w:354,h:399}; // to be moved into gamePage.js
const maxWidth = 951;
const minWidth = 48;
const maxHeight = 1000;
const minHeight = 50;
let hint = 0;
let startTime = 0;
let stopTime = 0;
let correctAnswer = '';


function showTooltip(e) {
    let element = e.srcElement;
    let tooltip = document.querySelector('.tooltip')
    tooltip.innerHTML = element.getAttribute('parkname');
    tooltip.style.visibility = 'visible';
}

function hideTooltip() {
    document.querySelector('.tooltip').style.visibility = 'hidden';
}


function renderQuestion(park, img, hint=0) {

    document.querySelector('.park-name').innerHTML = '???'
    document.querySelector('.park-description').innerHTML = '???????????????????????????'
    document.querySelector('.park-description').classList.add('text-center', 'green');


    if (hint == 0) {
        document.querySelector('.park-img').src = img.src;
    }
    if (hint > 0) {
        document.querySelector('.park-name').classList.add('green');
        document.querySelector('.park-description').classList.remove('text-center', 'green');
        document.querySelector('.park-description').innerHTML = park.description.replaceAll(/Alabama|Alaska|American Samoa|Arizona|Arkansa|California|Colorado|Connecticut|Delaware|District of Columbia|Federated States of Micronesia|Florida|Georgia|Guam|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Marshall Islands|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Northern Mariana Islands|Ohio|Oklahoma|Oregon|Palau|Pennsylvania|Puerto Rico|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virgin Island|Virginia|Washington|West Virginia|Wisconsin|Wyoming/ig, '_____');  
        document.querySelector('.park-description').innerHTML = document.querySelector('.park-description').innerHTML.replaceAll(park.name, '<span class="green">_____</span>');    
    }
    if (hint > 1) {
        document.querySelector('.park-name').classList.remove('green');
        document.querySelector('.park-name').innerHTML = park.name;
        document.querySelector('.park-description').innerHTML = document.querySelector('.park-description').innerHTML.replaceAll('<span class="green">_____</span>', `<span class="green">${park.name}</span>`); 
    }

    
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

    startTime = performance.now();
}

function renderScoreBreakdownTable(correctStates) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);

    const tbody = document.querySelector('.score-breakdown-table tbody');

    let answerMultiplier = 0;
    let hintMultiplier = 0;
    let timeMultiplier = 1;
    let total = 0;

    if (userAnswer == correctStates[0]) {
        answerMultiplier = 1.0;
    } else {
        answerMultiplier = 0.0;
    }

    switch(hint) {
        case 0:
            hintMultiplier = 1.25;
            break;
        case 1:
            hintMultiplier = 1.0;
            break;
        case 2:
            hintMultiplier = 0.75;
            break;
    }

    let elapsedTime = endTime - startTime; //in ms 
    elapsedTime /= 1000; 

    let seconds = Math.round(elapsedTime);
    
    timeMultiplier = 2.25 * Math.abs(1 - (seconds / 60));
    timeMultiplier = Math.round(timeMultiplier * 100) / 100;

    timeMultiplier = Math.min(timeMultiplier, 1.6);
    timeMultiplier = Math.max(timeMultiplier, 1.0);


    total = Math.round(100 * answerMultiplier * hintMultiplier * timeMultiplier);



    tbody.innerHTML = `
        <tr>
            <td>Answer</td>
            <td class=''><100 miles</td>
            <td class=''><p>50</p></td>
        </tr>
        <tr>
            <td>Hints</td>
            <td class=''>0 Hints</td>
            <td>x${hintMultiplier}</td>
        </tr>
        <tr>
            <td>Time</td>
            <td class=''>5 Seconds</td>
            <td class=''>x${timeMultiplier}</td>
        </tr>
        <tr>
            <td>Streak</td>
            <td>7x</td>
            <td>x1.3</td>
        </tr>
        <tr>
            <td>Total</td>
            <td></td>
            <td>${total}</td>
        </tr>
        `;

    document.querySelector('.score').setAttribute('data-score', parseInt(document.querySelector('.score').innerHTML) + total)
}

function resetScorBreakdownTable() {
    document.querySelector('.score-breakdown-table tbody').innerHTML = `
    <tr>
        <td>Base</td>
        <td>100</td>
    </tr>
    <tr>
        <td>Answer</td>
        <td>???</td>
    </tr>
    <tr>
        <td>Hints</td>
        <td>???</td>
    </tr>
    <tr>
        <td>Time</td>
        <td>???</td>
    </tr>
    <tr>
        <td>Total</td>
        <td>???</td>
    </tr>
    `;
}

function renderAnswer(correctAnswer, park) {
    const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    let correctStates = correctAnswer.split(',');
    let stateNamesString = '';
    for (let i in correctStates) {
        states[correctStates[i]].numberOfParks++;
        if (i > 0) {
            stateNamesString += ', ';
        }
        stateNamesString += getStateFullName(correctStates[i]);
    }
    let cord = lonLatToXY(park.longitude, park.latitude);
    document.querySelector('.answer-container .btn-next').classList.remove('hidden');
    //viewBox = {x:states[correctStates[0]].viewBox.x, y:states[correctStates[0]].viewBox.y, w:states[correctStates[0]].viewBox.w, h:states[correctStates[0]].viewBox.h};
    //document.querySelector('svg').setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`)

    if (correctAnswer.includes(userAnswer)) {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        // document.querySelector('.answer-container i').className = 'fas fa-check fa-9x';
        // document.querySelector('.answer-container h1').innerHTML = '+1';
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        for (let i of correctStates) {
            states[i].correctParks++;
        }
        document.querySelector('.mapSvg').innerHTML += `<circle cx='${cord.x}' cy='${cord.y}' r='15' fill='#33ff00' parkname='${park.name}' onmouseenter='showTooltip(event)' onmouseleave='hideTooltip()' ontouchstart='showTooltip(event)' ontouchend='hideTooltip()'> </circle>`
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        // document.querySelector('.answer-container i').className = 'fas fa-times fa-9x';
        // document.querySelector('.answer-container h1').innerHTML = '';
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        document.querySelector('.mapSvg').innerHTML += `<circle cx='${cord.x}' cy='${cord.y}' r='15' fill='#ff4000' parkname='${park.name}' onmouseenter='showTooltip(event)' onmouseleave='hideTooltip()' ontouchstart='showTooltip(event)' ontouchend='hideTooltip()'> </circle>`
    }
    document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.name;

    renderScoreBreakdownTable(correctStates);
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

function pathClickHandler(path) {
    document.querySelector('.text-input').value = path.getAttribute('title');
}

function displayTutorial(tutorial) {
    if (tutorial == 1) {
        document.querySelector('.park-description-container').innerHTML += `
            <div class='tutorial-mask crt'>
            </div>
            <div class='tutorial-container'>
                <svg viewBox='0 40 100 20' height='74' width='300'>
                    <rect x='10' y='45' width='80' height='1' fill='#d8d8d8' /> 
                    <rect x='10' y='55' width='80' height='1' fill='#d8d8d8' />   
                    <rect x='0' y='50' width='20' height='1' fill='#d8d8d8' style='transform: rotate(-45deg) translate(-35px, -15px);' />  
                    <rect x='0' y='50' width='20' height='1' fill='#d8d8d8' style='transform: rotate(45deg) translate(35px, -15px);' /> 
                </svg>
                <p class='text-center white' style='text-transform: uppercase;'>Swipe To Show Map</p>
            </div>
        `;
        setTimeout( () => {
            document.querySelector('.tutorial-container').style.opacity = 1;
        }, 0)
    }
    if (tutorial == 2) {
        document.querySelector('.tutorial-container').remove();
        let container = document.createElement('div');
        container.classList.add('tutorial-container');
        container.innerHTML = `
            <p class='state-answer white text-center mt-1' style='text-transform: uppercase;'>Select A State Then Submit or</p> 
            <svg viewBox='0 40 100 20' height='74' width='300'>
                <rect x='10' y='45' width='80' height='1' fill='#d8d8d8' /> 
                <rect x='10' y='55' width='80' height='1' fill='#d8d8d8' />   
                <rect x='100' y='50' width='20' height='1' fill='#d8d8d8' style='transform: rotate(-135deg) translate(-205px, -15px);' />  
                <rect x='100' y='50' width='20' height='1' fill='#d8d8d8' style='transform: rotate(135deg) translate(-136px, -156px);' /> 
            </svg>
            <p class='text-center white' style='text-transform: uppercase;'>Swipe To Show Question</p>
        `;

        document.querySelector('.answer-container').appendChild(container);

        setTimeout( () => {
           document.querySelector('.tutorial-container').style.opacity = 1;
        }, 0)
    }
    
    
}

function gamePage(data, numberOfQuestions) {

    let parks = [];
    let parkIterator = 0;
    let img = new Image;
    let randomInex = 0;
    let correctAnswer = '';

    document.querySelector('.card').innerHTML = renderGamePage();

    document.querySelector('.status').classList.remove('hidden');

    // Reset states object in case user restarts game
    for (let i in states) {
        states[i].numberOfParks = 0;
        states[i].correctParks = 0;
    }

    for (let i in data) {
        if (data[i].designation.includes("National Park")) parks.push(data[i]); 
    }

    generateRandomParkOrder(parks);
   
    randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator].images).length);
    img.src = parks[parkIterator].images[randomIndex].url;
    renderQuestion(parks[parkIterator], img);
    correctAnswer = parks[parkIterator].states;

    randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
    img.src = parks[parkIterator + 1].images[randomIndex].url;


    document.querySelector('.question-counter').innerHTML = 1;
    document.querySelector('.question-total').innerHTML = numberOfQuestions;
    document.querySelector('.score').innerHTML = 0;

    setTimeout( () => {
        displayTutorial(1);
    }, 3000);


    document.querySelectorAll('.state-paths > *').forEach( (path) => {
        path.setAttribute('onclick', "pathClickHandler(this)");
        path.setAttribute('ontouchstart', "pathClickHandler(this)");
    })

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

    addButtonEventListeners()

    let svgImage = document.querySelector('.mapSvg');
    let svgContainer = document.querySelector('.svg-container');

    svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    const svgSize = {w:svgImage.clientWidth,h:svgImage.clientHeight};
    var isPanning = false;
    let isZomming = false;
    var startPoint = {x:0,y:0};
    var endPoint = {x:0,y:0};
    var scale =  svgSize.w/viewBox.w;
    let startPoint2 = {x:0,y:0};
    let endPoint2 = {x:0,y:0}
    let svgRect = svgImage.getBoundingClientRect();
    let panningCoeficient = 2;
    
    let startX = 0;
    let startY = 0;

    document.querySelector('.text-input').addEventListener('blur', () => {
        window.scrollTo(0, 0);
    })

    document.querySelector('.svg-container').onwheel = function(e) {
        e.preventDefault();
        var w = viewBox.w;
        var h = viewBox.h;
        var mx = e.offsetX;
        var my = e.offsetY;  

        scale = svgSize.w/viewBox.w;
        
        if (((viewBox.w >= maxWidth || viewBox.h >= maxHeight ) && e.deltaY > 0) || ((viewBox.w <= minWidth || viewBox.h <= minHeight ) && e.deltaY < 0) ) {
            var dx = 0;
            var dy = 0;
            var dw = 0;
            var dh = 0;
        } else { 
            var dw = w*Math.sign(-e.deltaY)*0.08;
            var dh = h*Math.sign(-e.deltaY)*0.08;
            var dx = dw*mx/svgSize.w;
            var dy = dh*my/svgSize.h;
 
        }
        document.querySelectorAll('circle').forEach( (circle) => {
            circle.setAttribute('r', ((viewBox.w - minWidth) / (maxWidth - minWidth) * 10) + 4) 
        })

        viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
        svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    

    svgContainer.onmousedown = function(e){
        isPanning = true;
        startPoint = {x:e.x,y:e.y};  
    }

    svgContainer.ontouchstart = function(e){
        e.preventDefault();
        
        svgRect = svgImage.getBoundingClientRect()


        isPanning = true;
        startPoint = {x:e.touches[0].screenX - svgRect.left ,y:e.touches[0].screenY - svgRect.top};   
        

        if (e.touches[1]) {
            startPoint2 = {x:e.touches[1].screenX - svgRect.left,y:e.touches[1].screenY - svgRect.top}
            isZomming = true;

            startX = (startPoint.x + startPoint2.x ) / 2
            
            startY = (startPoint.y + startPoint2.y ) / 2
           
        }
        let tooltip = document.querySelector('.tooltip')
        let tooltipRect = tooltip.getBoundingClientRect();
        document.querySelector('.tooltip').style.left = e.touches[0].screenX - svgRect.left - ((tooltipRect.right - tooltipRect.left) / 2) + 'px';
        document.querySelector('.tooltip').style.top = e.touches[0].screenY - svgRect.top - 80 + 'px';
    }
    
    svgContainer.onmousemove = function(e){
        if (isPanning){
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
        svgRect = svgImage.getBoundingClientRect();
        let tooltip = document.querySelector('.tooltip')
        let tooltipRect = tooltip.getBoundingClientRect();
        document.querySelector('.tooltip').style.left = e.pageX - svgRect.left - ((tooltipRect.right - tooltipRect.left) / 2) + 'px';
        document.querySelector('.tooltip').style.top = e.pageY - svgRect.top - 40 + 'px';
    }

    svgContainer.ontouchmove = function(e){
        svgRect = svgImage.getBoundingClientRect()
        if (isPanning){
            endPoint = {x:e.touches[0].screenX - svgRect.left,y:e.touches[0].screenY - svgRect.top};
            var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
            // document.querySelector('.state-answer').innerHTML = `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`
        }
        if (isZomming) {
            endPoint = {x:e.touches[0].screenX - svgRect.left,y:e.touches[0].screenY - svgRect.top};
            endPoint2 = {x:e.touches[1].screenX - svgRect.left,y:e.touches[1].screenY - svgRect.top};
            let startDistance = Math.sqrt(Math.pow(startPoint.x - startPoint2.x, 2) + Math.pow(startPoint.y - startPoint2.y, 2));
            let endDistance =  Math.sqrt(Math.pow(endPoint.x - endPoint2.x, 2) + Math.pow(endPoint.y - endPoint2.y, 2));
            let delta = endDistance / startDistance - 1;

            startPoint.x = endPoint.x;
            startPoint.y = endPoint.y;
            startPoint2.x = endPoint2.x;
            startPoint2.y = endPoint2.y;
            var w = viewBox.w;
            var h = viewBox.h;

            if (((viewBox.w >= maxWidth || viewBox.h >= maxHeight ) && delta < 0) || ((viewBox.w <= minWidth || viewBox.h <= minHeight ) && delta > 0) ) {
                var dx = 0;
                var dy = 0;
                var dw = 0;
                var dh = 0;
            } else { 
                var dw = w*delta;
                var dh = h*delta;
                var dx = dw*startX/svgSize.w;
                var dy = dh*startY/svgSize.h;
     
            }
            scale = svgSize.w/viewBox.w;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

            document.querySelectorAll('circle').forEach( (circle) => {
                circle.setAttribute('r', ((viewBox.w - minWidth) / (maxWidth - minWidth) * 8) + 6) 
            })


            
        }

        //document.querySelector('.state-answer').innerHTML = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;

        
    }
    
    svgContainer.onmouseup = function(e){
        if (isPanning){ 
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    }

    svgContainer.ontouchend = function(e){
        if (isPanning){ 
            if (!endPoint.x == 0 && !endPoint.y == 0) {
                var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
                var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
                viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
                svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            }
            isPanning = false;
            endPoint.x = 0;
            endPoint.y = 0;
        }
        if (isZomming) {
            isZomming = false;
        }
    }
    
    svgContainer.onmouseleave = function(e){
        if (isPanning){ 
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    }
    
    document.querySelector('.question-container').ontouchstart = (e) => {
        startX = e.touches[0].screenX;
        document.querySelector('.question-mask').classList.remove('width-transition')
    } 
    let endX = 0;
    document.querySelector('.question-container').ontouchmove = (e) => {
        e.preventDefault();
        endX = e.touches[0].screenX;
        document.querySelector('.question-mask').style.width = parseInt(document.querySelector('.question-mask').offsetWidth) + (endX - startX) + 'px';
        startX = endX;
    }

    document.querySelector('.question-container').ontouchend = (e) => {
     
        
        startX = 0;
        endX = 0;
       
        if (document.querySelector('.question-mask').offsetWidth < document.querySelector('.card').offsetWidth * 0.7 ) {
            document.querySelector('.question-mask').classList.add('width-transition')
            document.querySelector('.question-mask').style.width = '0px';
            if (parseInt(document.querySelector('.question-counter').innerHTML)) {
                setTimeout( () => {
                    displayTutorial(2);
                }, 3000);
            }
        } else {
            document.querySelector('.question-mask').classList.add('width-transition')
            document.querySelector('.question-mask').style.width = '100%';
        }

        if (document.querySelector('.question-mask').offsetWidth == (document.querySelector('.card').offsetWidth - 4)) {
            document.querySelector('.question-mask').style.width = '85%';
            setTimeout( () => {
                document.querySelector('.question-mask').style.width = '100%';
            }, 300)
        }
    }

    document.querySelector('.answer-container').ontouchstart = (e) => {
        if (e.srcElement !== svgImage && e.srcElement.parentElement.parentElement !== svgImage) {
            startX = e.touches[0].screenX;
            document.querySelector('.question-mask').classList.remove('width-transition')
        }
    } 
    document.querySelector('.answer-container').ontouchmove = (e) => {
        if (e.srcElement !== svgImage && e.srcElement.parentElement.parentElement !== svgImage) {
            e.preventDefault();
            endX = e.touches[0].screenX;
            document.querySelector('.question-mask').style.width = parseInt(document.querySelector('.question-mask').offsetWidth) + (endX - startX) + 'px';
            startX = endX;
        }
    }

    document.querySelector('.answer-container').ontouchend = (e) => {
        if (e.srcElement !== svgImage && e.srcElement.parentElement.parentElement !== svgImage) {
            startX = 0;
            endX = 0;
            if (document.querySelector('.question-mask').offsetWidth < (document.querySelector('.card').offsetWidth) * 0.3 ) {
                document.querySelector('.question-mask').classList.add('width-transition')
                document.querySelector('.question-mask').style.width = '0px';
            } else {
                document.querySelector('.question-mask').classList.add('width-transition')
                document.querySelector('.question-mask').style.width = '100%';
            }
        }
    }

    function addButtonEventListeners() {
        document.addEventListener('keyup', (e) => {
            if (e.key == 'Enter') {
                if (document.querySelector('.question-mask').style.zIndex == 10 && !document.querySelector('.btn-submit').classList.contains('disabled')) {
                    // When question is displayed
                    const values = submitBtnHandler(parks, parkIterator, correctAnswer, img);
                    correctAnswer = values.correctAnswer;
                    parkIterator = values.parkIterator;
                    hint = values.hint;
                } else  if (document.querySelector('.answer-mask').style.zIndex == 10 && !document.querySelector('.btn-next').classList.contains('disabled')) {
                    // When answer is displayed
                    const values = nextBtnHandler(parkIterator, numberOfQuestions, parks[parkIterator + 1]);
                    img.src = values.imgSrc;
                }
            }
        });

        document.querySelector('.btn-submit').addEventListener('click', () => {
            const values = submitBtnHandler(parks, parkIterator, correctAnswer, img);
            correctAnswer = values.correctAnswer;
            parkIterator = values.parkIterator;
            hint = values.hint;
        });

        document.querySelector('.btn-submit').addEventListener('keypress', (e) => {
            e.preventDefault();
        });

        document.querySelector('.btn-next').addEventListener('click', () => {
            const values = nextBtnHandler(parkIterator, numberOfQuestions, parks[parkIterator + 1]);
            img.src = values.imgSrc;
        })

        document.querySelector('.btn-next').addEventListener('keypress', (e) => {
            e.preventDefault();
        });

        document.querySelector('.btn-hint').addEventListener('click', () => {
            const values = hintBtnHander(parks[parkIterator], hint);
            hint = values.hint;
        });
    }
}



function keyboardHandler(e) {
  
}

function submitBtnHandler(parks, parkIterator, correctAnswer, img) {
    let currentPark = parks[parkIterator];
    let nextPark = parks[parkIterator + 1];
    endTime = performance.now();
    renderAnswer(correctAnswer, currentPark);
    if (parseInt(document.querySelector('.question-mask').offsetWidth) > 0) { 
        // Question is currently displayed
        displayAnswer();
        setTimeout(() => {
            renderQuestion(nextPark, img);
        }, wipeTransitionTime );
    } else {
        // Map is currently displayed
        renderQuestion(nextPark, img);
    }

    return {
        correctAnswer: nextPark.states,
        parkIterator: parkIterator + 1,
        hint: 0
    }
}

function nextBtnHandler(parkIterator, numberOfQuestions, nextPark) {
    document.querySelector('.btn-hint').classList.remove('disabled');
    if (parkIterator < numberOfQuestions) {
        displayQuestion();
        // load next image
        let randomIndex = Math.floor(Math.random() * Object.keys(nextPark.images).length);
        return {imgSrc: nextPark.images[randomIndex].url};
        resetScorBreakdownTable();
    } else {
        document.querySelector('.score').innerHTML = document.querySelector('.score').getAttribute('data-score');
        resultPage();
    }
    return null;
}

function hintBtnHander(park, hint) {
    renderQuestion(park, null, ++hint);
    if (hint > 1) {
        document.querySelector('.btn-hint').classList.add('disabled');
        document.querySelector('.btn-hint').blur();
    }
    return {
        hint: hint
    }
}

function showMapBtnHandler() {

}

states = {
    AZ: {numberOfParks: 0, correctParks: 0, viewBox: {x:145, y:410, w:345, h:207}},
    AL: {numberOfParks: 0, correctParks: 0, viewBox: {}},
    AK: {numberOfParks: 0, correctParks: 0, viewBox: {x:16, y:581, w:433, h:260}},
    AS: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    AR: {numberOfParks: 0, correctParks: 0, viewBox: {x:651, y:399, w:313, h:188}},
    CA: {numberOfParks: 0, correctParks: 0, viewBox: {x:-162, y:256, w:529, h:317}},
    CO: {numberOfParks: 0, correctParks: 0, viewBox: {x:320, y:270, w:326, h:197}},
    CT: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    DC: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    DE: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    FL: {numberOfParks: 0, correctParks: 0, viewBox: {x:866, y:602, w:326, h:196}},
    GA: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    HI: {numberOfParks: 0, correctParks: 0, viewBox: {x:291, y:591, w:326, h:196}},
    ID: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    IL: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    IN: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    IA: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    KS: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    KY: {numberOfParks: 0, correctParks: 0, viewBox: {x:819, y:305, w:333, h:200}},
    LA: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    ME: {numberOfParks: 0, correctParks: 0, viewBox: {x:1224, y:43, w:333, h:200}},
    MD: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    MA: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    MI: {numberOfParks: 0, correctParks: 0, viewBox: {x:764, y:40, w:441, h:265}},
    MN: {numberOfParks: 0, correctParks: 0, viewBox: {x:579, y:-7, w:386, h:232}},
    MS: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    MO: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    MT: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    NE: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    NV: {numberOfParks: 0, correctParks: 0, viewBox: {x:-13, y:255, w:414, h:248}},
    NH: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    NJ: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    NM: {numberOfParks: 0, correctParks: 0, viewBox: {x:303, y:417, w:320, h:192}},
    NY: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    NC: {numberOfParks: 0, correctParks: 0, viewBox: {x:972, y:367, w:320, h:192}},
    ND: {numberOfParks: 0, correctParks: 0, viewBox: {x:456, y:-15, w:322, h:193}},
    OH: {numberOfParks: 0, correctParks: 0, viewBox: {x:889, y:229, w:331, h:199}},
    OK: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    OR: {numberOfParks: 0, correctParks: 0, viewBox: {x:-47, y:104, w:331, h:199}},
    PA: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    RI: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    SC: {numberOfParks: 0, correctParks: 0, viewBox: {x:940, y:433, w:331, h:199}},
    SD: {numberOfParks: 0, correctParks: 0, viewBox: {x:447, y:79, w:331, h:199}},
    TN: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    TX: {numberOfParks: 0, correctParks: 0, viewBox: {x:654, y:1207, w:236, h:142}},
    UT: {numberOfParks: 0, correctParks: 0, viewBox: {x:613, y:1143, w:119, h:72}},
    VT: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    VI: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    VA: {numberOfParks: 0, correctParks: 0, viewBox: {x:945, y:1174, w:84, h:50}},
    WA: {numberOfParks: 0, correctParks: 0, viewBox: {x:534, y:1043, w:90, h:54}},
    WV: {numberOfParks: 0, correctParks: 0, viewBox: {x:943, y:1160, w:82, h:50}},
    WI: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}},
    WY: {numberOfParks: 0, correctParks: 0, viewBox: {x:0, y:0, w:0, h:0}} 
}

map = {
    correctParks: [],
    wrongParks: []
}