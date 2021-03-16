//let viewBox = {x:617,y:963,w:274,h:309};

const maxWidth = 951;
const minWidth = 48;
const maxHeight = 1000;
const minHeight = 50;
const circleConstant = 12.5;
//const viewBoxStart = {x:617,y:963,w:274,h:309};

const maxExpandedNode = 6;
let mapNodes = [];

function expandChainNode(chainNode) {
    console.log('expanded')
    chainNode.querySelectorAll('.subNode').forEach( subNode => subNode.classList.remove('hidden'));

}

function condenseChainNode(chainNode) {
    console.log('condensed')
    chainNode.querySelectorAll('.subNode').forEach( subNode => subNode.classList.add('hidden'));
}

function createParkNode(park, answerFlag) {
    // Add node to dom
    let cord = lonLatToXY(park.longitude, park.latitude);
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
    answerFlag ? circle.setAttribute('fill', '#33ff00') : circle.setAttribute('fill', '#ff4000');
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

function addMapNavigationEventListeners() {
    let svgImage = document.querySelector('.mapSvg');
    let viewBox = {x: 450, y: 975, w: svgImage.getBoundingClientRect().width ,h: svgImage.getBoundingClientRect().height}; 
    let viewBoxStart = viewBox; 
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

        

        let chainNode = document.createElementNS('http://www.w3.org/2000/svg','g');
        chainNode.setAttribute('parknames', parkNames);
        chainNode.classList.add('chainNode');
        chainNode.setAttribute('onmouseenter', "expandChainNode(this)");
        chainNode.setAttribute('onmouseleave', "condenseChainNode(this)");

        chainNode.innerHTML = `
                <circle cx='${averageX}' cy='${averageY}' r='${circleConstant / (viewBoxStart.w / viewBox.w)}' fill='#282828' fill-opacity="1" stroke='#00ff33' stroke-width='${circleConstant * 0.19 / (viewBoxStart.w / viewBox.w)}'></circle> 
                <text x='${averageX}' y='${averageY}' text-anchor='middle' fill='white' fill-opacity='1' font-size='${circleConstant * 1.75 / (viewBoxStart.w / viewBox.w)}' font-family='Arial' dy=".3em" >${chain.length}</text>
            
        `;


        for (let i in chain) {
            let subNode = document.createElementNS('http://www.w3.org/2000/svg','circle');
            subNode.setAttribute('parkname', chain[i].parkName)
            subNode.classList.add('subNode', 'hidden');
            subNode.setAttribute('fill', '#33ff00');
            subNode.setAttribute('fill-opacity', '1');
            subNode.setAttribute('cx', averageX + Math.sin(2 * Math.PI / chain.length * i) * 80);
            subNode.setAttribute('cy', averageY - Math.cos(2 * Math.PI / chain.length * i) * 80);
            subNode.setAttribute('r', circleConstant / (viewBoxStart.w / viewBox.w));
            subNode.setAttribute('onmouseenter', 'showTooltip(event)');
            subNode.setAttribute('onmouseleave', 'hideTooltip()');
            subNode.setAttribute('ontouchstart', 'showTooltip(event)');
            subNode.setAttribute('ontouchend', 'hideTooltip()');
            
            chainNode.appendChild(subNode);
            subNode.textContent = 'test';
        }

        document.querySelector('.mapSvg').appendChild(chainNode);
        
        
    }

    function removeChainNode(chainNode) {
       
        let parkNames = chainNode.getAttribute('parknames').split(',');

        try {
           
            document.querySelector(`.chainNode[parkNames*="${parkNames[0]}"]`).remove();
        } catch (err) {

        }
    }

    function updateChainNode(chain) {
        
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

            let oldParkNamesArray = chainNode.getAttribute('parknames').split(',');

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

            // update subNodes
            // chainNode.querySelectorAll('.subNode').forEach( subNode => {
            //     subNode.remove();
            // })

            for (let i in chain) {
                console.log(chain[i].parkName + ': ' + oldParkNamesArray.includes(chain[i].parkName))
                if (!oldParkNamesArray.includes(chain[i].parkName)) {
                    let subNode = document.createElement('circle');
                    subNode.setAttribute('parkname', chain[i].parkName)
                    subNode.classList.add('subNode', 'hidden');
                    subNode.setAttribute('fill', '#33ff00');
                    subNode.setAttribute('fill-opacity', '1');
                    subNode.setAttribute('cx', averageX + Math.sin(2 * Math.PI / chain.length * i) * 80);
                    subNode.setAttribute('cy', averageY - Math.cos(2 * Math.PI / chain.length * i) * 80);
                    subNode.setAttribute('r', circleConstant / (viewBoxStart.w / viewBox.w));
                    subNode.setAttribute('onmouseenter', 'showTooltip(event)');
                    subNode.setAttribute('onmouseleave', 'hideTooltip()');
                    subNode.setAttribute('ontouchstart', 'showTooltip(event)');
                    subNode.setAttribute('ontouchend', 'hideTooltip()');
                    subNode.textContent = 'test';
                    chainNode.appendChild(subNode);
                }
                
            }

            document.querySelector('.mapSvg').innerHTML += '';


    
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
            //var dx = (((mx/svgSize.w) * (1.64 - -0.64)) - 0.64) * dw
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

        try {
            currentRadius = parseInt(document.querySelector('circle').getAttribute('r'));
        } catch (err) {

        }
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

                let query = "";
                for (let i in chain) {
                    query += `.chainNode[parknames*="${chain[i].parkName}"]`;
                    if (i < chain.length - 1) {
                        query += ',';
                    }
                }

                if (document.querySelector(query) === null) {
                    addChainNode(chain)
                }
                const chainNode = document.querySelector(query);

                
                for (let node of chain) {

                    document.querySelector(`[parkname="${node.parkName}"]`).style.visibility = 'hidden';
                    newParkNames.push(node.parkName);
                }
                
                
                const oldParkNames = chainNode.getAttribute('parknames').split(',');

                if (newParkNames.length > oldParkNames.length) {
                    let oldParkNamesSet = new Set(oldParkNames);
                    let parkNamesDelta = [...new Set(newParkNames.filter(x => !oldParkNamesSet.has(x)))];
                    
                    let query = "";
                    for (let i in parkNamesDelta) {
                        query += `.chainNode[parknames*='${parkNamesDelta[i]}']`;
                        if (i < parkNamesDelta.length - 1) {
                            query += ',';
                        }
                    }
                    const chainNodes = document.querySelectorAll(query).forEach(chainNode => removeChainNode(chainNode));
                } 
                if (newParkNames.length != oldParkNames.length) {
                    updateChainNode(chain);
                }
               
                

            } else {
                // Single Node
                if (document.querySelector(`[parkname="${chain[0].parkName}"]`).style.visibility == 'hidden') {
                    
                    document.querySelector(`[parkname="${chain[0].parkName}"]`).style.visibility = 'visible';
                    try {
                        const chainNode = document.querySelector(`.chainNode[parkNames*='${chain[0].parkName}']`);
                        const parkNames = chainNode.getAttribute('parknames').split(',').filter(parkName => parkName !== chain[0].parkName);
                        
                        if (chains.find( chain => {
                            if (chain.find( node => parkNames.includes(node.parkName)) && chain.length > 1) {
                                return true;
                            } else {
                                return false;
                            }  
                        }) === undefined) {
                            removeChainNode(chainNode)
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
            var dx = (startPoint.x - endPoint.x)/scale//*panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale//*panningCoeficient;
            var movedViewBox = {x:viewBox.x+dx,y:viewBox.y+dy,w:viewBox.w,h:viewBox.h};
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
        svgRect = svgImage.getBoundingClientRect();
        let tooltip = document.querySelector('.tooltip')
        let tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = e.pageX - svgRect.left - ((tooltipRect.right - tooltipRect.left) / 2) + 16 + 'px';
        tooltip.style.top = e.pageY - svgRect.top - 40 + 'px';
    }

    svgContainer.onmouseup = function(e){
        if (isPanning){ 
            endPoint = {x:e.x,y:e.y};
            var dx = (startPoint.x - endPoint.x)/scale//*//////panningCoeficient;
            var dy = (startPoint.y - endPoint.y)/scale//*panningCoeficient;
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