const transitionTimeLong = 500; // in milliseconds
const transitionTimeShort = 300; // in milliseconds
let startTime = 0;
let stopTime = 0;
let hint = 0;
let streak = 0;
let totalCorrectAnswers = 0;

function showTooltip(e) {
    console.log(e)
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
    document.querySelector('.btn-map-toggle').classList.remove('disabled')
    document.querySelector('.btn-next').blur();
    document.querySelector('.question-counter').innerHTML = parseInt(document.querySelector('.question-counter').innerHTML) + 1;
    document.querySelector('.text-input').value = '';
    document.querySelector('.btn-map-toggle').value = 'Map';

    document.querySelector('.answer-mask').classList.add('width-transition-long');
    setTimeout(() => {
        document.querySelector('.answer-mask').style.width = 0; 
    }, 0);

    setTimeout( () => {
        document.querySelector('.answer-mask').style.zIndex = 5;
        document.querySelector('.question-mask').style.zIndex = 10;
        document.querySelector('.answer-mask').classList.add('width-transition-long');
        document.querySelector('.btn-submit').classList.remove('disabled');
        setTimeout(() => {
            document.querySelector('.answer-mask').style.width = '100%';
        }, 0);
    }, transitionTimeLong)

    document.querySelector('.score').innerHTML = document.querySelector('.score').getAttribute('data-score');

    startTime = performance.now();
}



function resetScorBreakdownTable() {
    document.querySelector('.score-breakdown-table tbody').innerHTML = `
        <tr>
            <td>Answer</td>
            <td class=''>???</td>
            <td class=''>???</td>
        </tr>
        <tr>
            <td>Hints</td>
            <td class=''>???</td>
            <td>???</td>
        </tr>
        <tr>
            <td>Time</td>
            <td class=''>???</td>
            <td class=''>???</td>
        </tr>
        <tr>
            <td>Streak</td>
            <td>???</td>
            <td>???</td>
        </tr>
        <tr>
            <td>Total</td>
            <td></td>
            <td>???</td>
        </tr>
    `;
}

function renderAnswer(correctAnswer, park) {
    let userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);


    let correctStates = correctAnswer.split(',');
    let stateNamesString = '';
    for (let i in correctStates) {
        states[correctStates[i]].numberOfParks++;
        if (i > 0) {
            stateNamesString += ', ';
        }
        stateNamesString += getStateFullName(correctStates[i]);
    }
   
    document.querySelector('.answer-container .btn-next').classList.remove('hidden');
    //viewBox = {x:states[correctStates[0]].viewBox.x, y:states[correctStates[0]].viewBox.y, w:states[correctStates[0]].viewBox.w, h:states[correctStates[0]].viewBox.h};
    //document.querySelector('svg').setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`)

    

    if (correctAnswer.includes(userAnswer)) {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('red', 'green');
        document.querySelector('.answer-container input').classList.add('btn-green-outline');
        document.querySelector('.answer-container input').classList.remove('btn-red-outline');
        for (let i of correctStates) {
            states[i].correctParks++;
        }
        createParkNode(park, true);
        streak += 1;
        totalCorrectAnswers += 1;
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        createParkNode(park, false)
        streak = 0;
    }
    document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.name;
    renderScoreBreakdownTable(correctStates, park);

    function renderScoreBreakdownTable(correctStates, park) {
        const userAnswer = getStateTwoDigitCode(document.querySelector('.text-input').value);
    
        const tbody = document.querySelector('.score-breakdown-table tbody');
    
        let answerPoints = 0;
        let answerMessage = '';
        let hintMultiplier = 0;
        let numberOfHints = 0;
        let timeMultiplier = 1;
        let streakMultiplier = 0;
        let total = 0;
    
    
        if (correctStates.find(i => i == userAnswer)) {
            answerPoints = 100;
            answerMessage = 'Correct';
        } else {
            // Formula found from https://www.movable-type.co.uk/scripts/latlong.html
            const R = 6371e3; // metres
            const φ1 = states[userAnswer].lat * Math.PI/180; // φ, λ in radians
            const φ2 = park.latitude * Math.PI/180;
            const Δφ = (park.latitude-states[userAnswer].lat) * Math.PI/180;
            const Δλ = (park.longitude-states[userAnswer].lon) * Math.PI/180;
    
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
            d = R * c * 0.000621371192; // in miles
            let answerMultiplier = 0.75 * (1 - d/1000);
    
            answerMultiplier = Math.min(answerMultiplier, 0.5);
            answerMultiplier = Math.max(answerMultiplier, 0);
            answerPoints = Math.round(100 * answerMultiplier);
    
            answerMessage = Math.round(d) + ' Miles';
        }
    
        switch(hint) {
            case 0:
                hintMultiplier = 1.5;
                break;
            case 1:
                hintMultiplier = 1.25;
                numberOfHints  = 1;
                break;
            case 2:
                hintMultiplier = 1;
                numberOfHints = 2;
                break;
        }
    
        let elapsedTime = endTime - startTime; //in ms 
        elapsedTime /= 1000; 
    
        let seconds = Math.round(elapsedTime);
        
        timeMultiplier = 1.67 * Math.abs(1 - (seconds / 80))
        timeMultiplier = Math.round(timeMultiplier * 100) / 100;
    
        timeMultiplier = Math.min(timeMultiplier, 1.5);
        timeMultiplier = Math.max(timeMultiplier, 1.0);
    
        streakMultiplier = Math.abs(0.834 + (streak / 12))
        streakMultiplier = Math.round(streakMultiplier * 100) / 100;
        streakMultiplier = Math.min(streakMultiplier, 1.5);
        streakMultiplier = Math.max(streakMultiplier, 1.0);
    
        total = Math.round(answerPoints * hintMultiplier * timeMultiplier * streakMultiplier);
    
    
        tbody.innerHTML = `
            <tr>
                <td>Answer</td>
                <td class=''>${answerMessage}</td>
                <td class=''>${answerPoints}</td>
            </tr>
            <tr>
                <td>Hints</td>
                <td class=''>${numberOfHints} Hints</td>
                <td>x${hintMultiplier}</td>
            </tr>
            <tr>
                <td>Time</td>
                <td class=''>${seconds} Seconds</td>
                <td class=''>x${timeMultiplier}</td>
            </tr>
            <tr>
                <td>Streak</td>
                <td>${streak}x</td>
                <td>x${streakMultiplier}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td></td>
                <td>${total}</td>
            </tr>
            `;
    
        document.querySelector('.score').setAttribute('data-score', parseInt(document.querySelector('.score').innerHTML) + total)
    }
}


function displayAnswer() {
    document.querySelector('.question-mask').classList.add('width-transition-long');
    setTimeout(() => {
        document.querySelector('.question-mask').style.width = 0;
    }, 0);
    document.querySelector('.btn-submit').classList.add('disabled');
    document.querySelector('.btn-submit').blur();
    document.querySelector('.btn-map-toggle').classList.add('disabled')

    setTimeout( () => {
        document.querySelector('.question-mask').style.zIndex = 5;
        document.querySelector('.answer-mask').style.zIndex = 10;
        document.querySelector('.question-mask').classList.remove('width-transition-long');
        document.querySelector('.btn-next').classList.remove('disabled');
        setTimeout( () => {
            document.querySelector('.question-mask').style.width = '100%';
        }, 0);
    }, transitionTimeLong)

 
}

function pathClickHandler(path) {
    document.querySelector('.text-input').value = path.getAttribute('title');
    try {
        document.querySelector('path.selected').classList.remove('selected');
    } catch (error) {
        
    } finally {
        path.classList.add('selected');
    }
}

function gamePage(data, numberOfQuestions) {

    let parks = [];
    let parkIterator = 0;
    let img = new Image;
    let randomIndex = 0;
    let correctAnswer = '';

    for (let i in data) {
        if (data[i].designation.includes("National Park")) parks.push(data[i]); 
    }
    generateRandomParkOrder(parks);

    document.querySelector('.card').innerHTML = renderGamePage();
    document.querySelector('.status').classList.remove('hidden');
    document.querySelector('.question-counter').innerHTML = 1;
    document.querySelector('.question-total').innerHTML = numberOfQuestions;
    document.querySelector('.score').innerHTML = 0;

    addButtonEventListeners();
    addMapNavigationEventListeners();
    addTouchSlideEventListeners();
    addUtilityEventListeners();
   

    randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator].images).length);
    img.src = parks[parkIterator].images[randomIndex].url;
    renderQuestion(parks[parkIterator], img);
    correctAnswer = parks[parkIterator].states;

    randomIndex = Math.floor(Math.random() * Object.keys(parks[parkIterator + 1].images).length);
    img.src = parks[parkIterator + 1].images[randomIndex].url;


    startTime = performance.now();

    function addButtonEventListeners() {
        document.addEventListener('keyup', (e) => {
            if (e.key == 'Enter') {
                if (document.querySelector('.question-mask').style.zIndex == 10 && !document.querySelector('.btn-submit').classList.contains('disabled')) {
                    // When question is displayed
                    if (getStateTwoDigitCode(document.querySelector('.text-input').value) !== undefined) {
                        const values = submitBtnHandler(parks, parkIterator, correctAnswer, img);
                        correctAnswer = values.correctAnswer;
                        parkIterator = values.parkIterator;
                        hint = values.hint;
                    } 
                } else  if (document.querySelector('.answer-mask').style.zIndex == 10 && !document.querySelector('.btn-next').classList.contains('disabled')) {
                    // When answer is displayed
                    const values = nextBtnHandler(parkIterator, numberOfQuestions, parks[parkIterator + 1]);
                    img.src = values.imgSrc;
                }
            }
        });

        document.querySelector('.text-input').addEventListener('input', () => {
            if (getStateTwoDigitCode(document.querySelector('.text-input').value) === undefined) {
                document.querySelector('.text-input').style.border = '1px solid var(--red)';
                document.querySelector('.text-input').style.color = 'var(--red)';
            } else {
                document.querySelector('.text-input').style.border = '1px solid var(--amber)';
                document.querySelector('.text-input').style.color = 'var(--green)';
            }
        });

        document.querySelector('.btn-submit').addEventListener('click', () => {
            if (getStateTwoDigitCode(document.querySelector('.text-input').value) !== undefined) {
                const values = submitBtnHandler(parks, parkIterator, correctAnswer, img);
                correctAnswer = values.correctAnswer;
                parkIterator = values.parkIterator;
                hint = values.hint;
            } 
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

        document.querySelector('.btn-map-toggle').addEventListener('click', () => {
            mapToggleHandler();
        })
    }

   

    function addTouchSlideEventListeners() {
        let svgImage = document.querySelector('.mapSvg');
        let startX = 0;
        let endX = 0;
        document.querySelector('.question-container').ontouchstart = (e) => {
            startX = e.touches[0].screenX;
            document.querySelector('.question-mask').classList.remove('width-transition')
        } 

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
                document.querySelector('.question-mask').classList.add('width-transition-short')
                document.querySelector('.question-mask').style.width = '0px';
                if (parseInt(document.querySelector('.question-counter').innerHTML)) {
                    setTimeout( () => {
                        displayTutorial(2);
                    }, 3000);
                }
            } else {
                document.querySelector('.question-mask').classList.add('width-transition-short')
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
                document.querySelector('.question-mask').classList.remove('width-transition-short')
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
                    document.querySelector('.question-mask').classList.add('width-transition-short')
                    document.querySelector('.question-mask').style.width = '0px';
                } else {
                    document.querySelector('.question-mask').classList.add('width-transition-short')
                    document.querySelector('.question-mask').style.width = '100%';
                }
            }
        }
    }

    function addUtilityEventListeners() {       
        document.querySelector('.text-input').addEventListener('blur', () => {
            window.scrollTo(0, 0);
        })

        document.querySelectorAll('.state-paths > *').forEach( (path) => {
            path.setAttribute('onclick', "pathClickHandler(this)");
            path.setAttribute('ontouchstart', "pathClickHandler(this)");
        })

        document.querySelector('.fullscreen-container').addEventListener('click', toggleImgFullscreen);

        document.addEventListener('fullscreenchange', () => {
            document.querySelector('.park-img').classList.toggle('fullscreen');
        });   
    }
}


function submitBtnHandler(parks, parkIterator, correctAnswer, img) {
    const currentPark = parks[parkIterator];
    const nextPark = parks[parkIterator + 1];
    
    endTime = performance.now();
    renderAnswer(correctAnswer, currentPark);
    if (parseInt(document.querySelector('.question-mask').offsetWidth) > 0) { 
        // Question is currently displayed
        displayAnswer();
        setTimeout(() => {
            renderQuestion(nextPark, img);
        }, transitionTimeLong );
    } else {
        // Map is currently displayed
        displayAnswer();
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

function mapToggleHandler() {
    document.querySelector('.btn-map-toggle').blur();
    document.querySelector('.btn-map-toggle').classList.add('disabled');
    if (parseInt(document.querySelector('.question-mask').offsetWidth) > 0) {
        document.querySelector('.question-mask').classList.add('width-transition-long')
        setTimeout(() => {
            document.querySelector('.question-mask').style.width = '0px';
        }, 0);
        document.querySelector('.btn-map-toggle').value = 'Question';
    } else {
        document.querySelector('.question-mask').classList.add('width-transition-long')
        setTimeout(() => {
            document.querySelector('.question-mask').style.width = '100%';
        }, 0);
        document.querySelector('.btn-map-toggle').value = 'Map';
    }
    setTimeout( () => {
        document.querySelector('.question-mask').classList.remove('width-transition-long')
        document.querySelector('.btn-map-toggle').classList.remove('disabled');
    }, transitionTimeLong)
}

function toggleImgFullscreen() {
    if (!document.fullscreenElement) {
        document.querySelector('.fullscreen-container').requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

map = {
    correctParks: [],
    wrongParks: []
}