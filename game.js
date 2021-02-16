const transitionTimeLong = 500; // in milliseconds
const transitionTimeShort = 300; // in milliseconds
let viewBox = {x:617,y:963,w:274,h:309};
const maxWidth = 951;
const minWidth = 48;
const maxHeight = 1000;
const minHeight = 50;
let startTime = 0;
let stopTime = 0;
let hint = 0;
let streak = 0;
let totalCorrectAnswers = 0;
const circleConstant = 12.5;
const viewBoxStart = {x:617,y:963,w:274,h:309};
let mapNodes = [];



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
    let cord = lonLatToXY(park.longitude, park.latitude);
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
        createParkNode(true);
        streak += 1;
        totalCorrectAnswers += 1;
    } else {
        document.querySelector('.answer-container').className = document.querySelector('.answer-container').className.replace('green', 'red');
        document.querySelector('.answer-container input').classList.add('btn-red-outline');
        document.querySelector('.answer-container input').classList.remove('btn-green-outline');
        createParkNode(false)
        streak = 0;
    }
    document.querySelector('.state-answer').innerHTML = stateNamesString + ' - ' + park.name;
    renderScoreBreakdownTable(correctStates, park);

    function createParkNode(answer) {
        // Add node to dom
        const circle = document.createElement('circle');
        circle.textContent = 'hello'
        circle.setAttribute('cx', cord.x);
        circle.setAttribute('cy', cord.y);
        circle.setAttribute('r', circleConstant / (viewBoxStart.w / viewBox.w));
        circle.setAttribute('parkname', park.name)
        circle.setAttribute('onmouseenter', 'showTooltip(event)');
        circle.setAttribute('onmouseleave', 'hideTooltip()');
        circle.setAttribute('ontouchstart', 'showTooltip(event)');
        circle.setAttribute('ontouchend', 'hideTooltip()');
        answer ? circle.setAttribute('fill', '#33ff00') : circle.setAttribute('fill', '#ff4000');
        document.querySelector('.mapSvg').appendChild(circle);

        // Add node to mapNodes object
        let node = {
            parkName: park.name,
            x: cord.x,
            y: cord.y,
            indexed: false
        }

        mapNodes.push(node)

        // new circles are not visible unless I use the line below and I don't know why 
        document.querySelector('.mapSvg').innerHTML += '';
    }

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

    function addMapNavigationEventListeners() {
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
        let panningCoeficient = 2.05;
        
        let startX = 0;
        let startY = 0;

        let currentRadius = 0;
        

        function findIntersectingNodes(node) {
            let children = [];
            let chain = [];
          
            node.indexed = true;
        
            for (let i in mapNodes) {
                
                if (!mapNodes[i].indexed) {
                    let overlap = !(node.x + currentRadius < mapNodes[i].x - currentRadius || node.x - currentRadius > mapNodes[i].x + currentRadius || node.y + currentRadius < mapNodes[i].y - currentRadius || node.y - currentRadius > mapNodes[i].y + currentRadius);
                    if (overlap) {
                        children.push(mapNodes[i])
                        mapNodes[i].indexed = true;
                    }
                }
                
            }
        
            if (children.length > 0) {
              for (let i in children) {
                let subChain = findIntersectingNodes(children[i]);
                for (let j in subChain) {
                    chain.push(subChain[j]);
                }
              }
            }
            chain.push(node)
            return chain;
        }

        function addChainNode(chain) {

            let averageX = 0;
            let averageY = 0;
            let parkNames = '';

            for(let i in chain) {
                averageX += chain[i].x;
                averageY += chain[i].y;
                parkNames += chain[i].parkName
                if (i < chain.length - 1) {
                    parkNames += ',';
                }
            }

            averageX /= chain.length;
            averageY /= chain.length;

            document.querySelector('.mapSvg').innerHTML += `
                <g class='chainNode' parkNames='${parkNames}'>
                    <circle cx='${averageX}' cy='${averageY}' r='${circleConstant / (viewBoxStart.w / viewBox.w)}' fill='#282828' stroke='#00ff33' stroke-width='${circleConstant * 0.19 / (viewBoxStart.w / viewBox.w)}' /> 
                    <text x='${averageX}' y='${averageY}' text-anchor='middle' fill='white' font-size='${circleConstant * 1.75 / (viewBoxStart.w / viewBox.w)}' font-family='Arial' dy=".3em">${chain.length}</text>
                </g>
            `;
        }

        function removeChainNode(chain) {
            try {
                console.log(document.querySelector(`.chainNode[parkNames*='${chain[0].parkName}']`))
                document.querySelector(`.chainNode[parkNames*='${chain[0].parkName}']`).remove();
            } catch (err) {

            }
        }

        function updateChainNode(chain) {
            try {
                let query = "";
                let parkNames = '';
                for (let i in chain) {
                    query += `.chainNode[parknames*='${chain[i].parkName}']`;
                    if (i < chain.length - 1) {
                        query += ',';
                    }
                    parkNames += chain[i].parkName
                    if (i < chain.length - 1) {
                        parkNames += ',';
                    }
                }

                const chainNode = document.querySelector(query);
                const circle = chainNode.querySelector('circle');
                const text = chainNode.querySelector('text');
                chainNode.setAttribute('parknames', parkNames)
                let averageX = 0;
                let averageY = 0;
    
                for(let i in chain) {
                    averageX += chain[i].x;
                    averageY += chain[i].y;
                }

                averageX /= chain.length;
                averageY /= chain.length;
                circle.setAttribute('cx', averageX);
                circle.setAttribute('cy', averageY);
                text.setAttribute('x', averageX);
                text.setAttribute('y', averageY);
                text.innerHTML = chain.length;
            } catch (err) {
                console.error(err)
            }
        }

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
                var dw = w*Math.sign(-e.deltaY)*0.12;
                var dh = h*Math.sign(-e.deltaY)*0.12;
                var dx = dw*mx/svgSize.w;
                var dy = dh*my/svgSize.h;
                var dx = (((mx/svgSize.w) * (1.64 - -0.64)) - 0.64) * dw
            }

    
            viewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w-dw,h:viewBox.h-dh};
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

           

            document.querySelectorAll('circle').forEach( (circle) => {
                circle.setAttribute('r', circleConstant / (viewBoxStart.w / viewBox.w)) 
            })

            document.querySelectorAll('.chainNode').forEach( (circle) => {
                circle.querySelector('circle').setAttribute('stroke-width', circleConstant * 0.19 / (viewBoxStart.w / viewBox.w)) 
                circle.querySelector('text').setAttribute('font-size', circleConstant * 1.75 / (viewBoxStart.w / viewBox.w)) 
            })

            currentRadius = parseInt(document.querySelector('circle').getAttribute('r'));
            for (let node of mapNodes) {
               node.indexed = false;
            }
            let chains = [];
            for (let node of mapNodes) {
                if (!node.indexed) {
                    chains.push(findIntersectingNodes(node));
                }
            }
            for (let chain of chains) {
                if (chain.length > 1) {
                    let newParkNames = []

                    let totalVisibility = true;
                    //let partialVisibility = false;
                    //let previousNodeVisibility = 0;
                    for (let node of chain) {
                        if (document.querySelector(`[parkname='${node.parkName}']`).style.visibility == 'hidden') {
                            totalVisibility = false;
                            //previousNodeVisibility === true ? partialVisibility = true : null;
                            //previousNodeVisibility = false;
                        } else {
                            //previousNodeVisibility === false ? partialVisibility = true : null;
                            //previousNodeVisibility = true;
                        }
                        document.querySelector(`[parkname='${node.parkName}']`).style.visibility = 'hidden';
                        newParkNames.push(node.parkName);
                    }
                    if (totalVisibility) {addChainNode(chain)}
                    // if (partialVisibility) {updateChainNode(chain)}
                    
                    let query = "";
                    for (let i in chain) {
                        query += `.chainNode[parknames*='${chain[i].parkName}']`;
                        if (i < chain.length - 1) {
                            query += ',';
                        }
                    }
                    
                    const chainNode = document.querySelector(query);
                    //const chainNode = document.querySelector(`.chainNode[parknames*='${chain[0].parkName}']`);
                    
                    const oldParkNames = chainNode.getAttribute('parknames').split(',');
                    console.log('oldParks: ' + oldParkNames)
                    console.log('newParks: ' + newParkNames)
                    if (newParkNames.length > oldParkNames.length) {
                        //    let parkNamesDelta = [];
                        var b1 = new Set(oldParkNames);
                        let parkNamesDelta = [...new Set(newParkNames.filter(x => !b1.has(x)))];
                        let query = "";
                        for (let i in parkNamesDelta) {
                            query += `.chainNode[parknames*='${parkNamesDelta[i]}']`;
                            if (i < parkNamesDelta.length - 1) {
                                query += ',';
                            }
                        }
                        console.log(query)
                        const chainNodes = document.querySelectorAll(query).forEach(chainNode => {console.log(chainNode);removeChainNode(chainNode.getAttribute('parknames').split(','))});
                    } 
                    if (newParkNames.length != oldParkNames.length) {
                        updateChainNode(chain);
                    }
                   
                    

                } else {
                    
                    if (document.querySelector(`[parkname="${chain[0].parkName}"]`).style.visibility == 'hidden') {
                        document.querySelector(`[parkname="${chain[0].parkName}"]`).style.visibility = 'visible';
                        try {
                            const chainNode = document.querySelector(`.chainNode[parkNames*='${chain[0].parkName}']`);
                            if (chainNode.getAttribute('parknames').split(',').length < 3) {
                                removeChainNode(chain)
                            }
                        } catch (err) {

                        }
                        
                    }
                    
                }

                
            }
        }

        svgContainer.onmousedown = function(e){
            isPanning = true;
            startPoint = {x:e.x,y:e.y};  
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
    
        svgContainer.ontouchmove = function(e){
            svgRect = svgImage.getBoundingClientRect()
            if (isPanning){
                endPoint = {x:e.touches[0].screenX - svgRect.left,y:e.touches[0].screenY - svgRect.top};
                var dx = (startPoint.x - endPoint.x)/scale*panningCoeficient;
                var dy = (startPoint.y - endPoint.y)/scale*panningCoeficient;
                var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
                svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
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
                    circle.setAttribute('r', circleConstant / (viewBoxStart.w / viewBox.w))
                })         
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