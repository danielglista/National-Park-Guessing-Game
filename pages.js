function renderMenuPage() {
    return `
    <div class="menu-container">
        <h1 class='green bold text-center'>National Park Guessing Game</h1>
        <p class='green'>Test your geography knowledge of our national parks by matching national parks with the state they reside in. You will get the park name, picture, and a brief description to help aid you. I hope you have fun, and learn something new about our beautiful parks.</p>
        <div class="question-slider-container">
            <input type='range' min='1' max='63' value='63' class='question-slider w-100' />
            <p class="green text-center">Number of Questions: <span class='amber question-display'>63</span></p>
        </div>
        <input type='button' class='btn btn-green-outline btn-start' value='Start' />
    </div>
    `;
}

function renderGamePage() {
    let game = `
    <div class="question-mask"  style='z-index: 10;'>
        <div class="question-container crt">
            <h2 class="park-name bold italic text-center"></h2>
            <div class='fullscreen-container'>
                <img class='park-img' src="" alt="">
                <i class="fas fa-expand fa-2x"></i>
            </div>
            <p class="park-description"></p>
        </div>
    </div>

    <div class="answer-mask" style='z-index: 5;'>
        <div class='answer-container green crt'>
            <i class="far fa-9x"></i>
            <h1></h1>
            <p class='state-answer'></p>
            <input class='btn btn-next disabled' type='button' value='Next' />
        </div>
    </div>

    <div class="buttons-container">
        <div class="input-buttons">
            <input class='text-input' list="states" name="state" placeholder="State"/>
            <datalist id="states">
                <option value="Alabama">Alabama</option>
                <option value="Alaska">Alaska</option>
                <option value='American Samoa'>American Samoa</option>
                <option value="Arizona">Arizona</option>
                <option value="Arkansas">Arkansas</option>
                <option value="California">California</option>
                <option value="Colorado">Colorado</option>
                <option value="Connecticut">Connecticut</option>
                <option value="Delaware">Delaware</option>
                <option value="District of Columbia">District of Columbia</option>
                <option value="Florida">Florida</option>
                <option value="Georgia">Georgia</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Idaho">Idaho</option>
                <option value="Illinois">Illinois</option>
                <option value="Indiana">Indiana</option>
                <option value="Iowa">Iowa</option>
                <option value="Kansas">Kansas</option>
                <option value="Kentucky">Kentucky</option>
                <option value="Louisiana">Louisiana</option>
                <option value="Maine">Maine</option>
                <option value="Maryland">Maryland</option>
                <option value="Massachusetts">Massachusetts</option>
                <option value="Michigan">Michigan</option>
                <option value="Minnesota">Minnesota</option>
                <option value="Mississippi">Mississippi</option>
                <option value="Missouri">Missouri</option>
                <option value="Montana">Montana</option>
                <option value="Nebraska">Nebraska</option>
                <option value="Nevada">Nevada</option>
                <option value="New Hampshire">New Hampshire</option>
                <option value="New Jersey">New Jersey</option>
                <option value="New Mexico">New Mexico</option>
                <option value="New York">New York</option>
                <option value="North Carolina">North Carolina</option>
                <option value="North Dakota">North Dakota</option>
                <option value="Ohio">Ohio</option>
                <option value="Oklahoma">Oklahoma</option>
                <option value="Oregon">Oregon</option>
                <option value="Pennsylvania">Pennsylvania</option>
                <option value="Rhode Island">Rhode Island</option>
                <option value="South Carolina">South Carolina</option>
                <option value="South Dakota">South Dakota</option>
                <option value="Tennessee">Tennessee</option>
                <option value="Texas">Texas</option>
                <option value="Utah">Utah</option>
                <option value="Vermont">Vermont</option>
                <option value='Virgin Islands'>Virgin Islands</option>
                <option value="Virginia">Virginia</option>
                <option value="Washington">Washington</option>
                <option value="West Virginia">West Virginia</option>
                <option value="Wisconsin">Wisconsin</option>
                <option value="Wyoming">Wyoming</option>
            </datalist>

            <input class='btn btn-amber-outline btn-submit' type="button" value='Submit' />
        </div>

        <input class='btn btn-green-outline btn-hint' type="button" value='Hint' />
    </div>
    `;

    return game;
}

function renderResultsPage() {
    let results = `
        <div class='results-container amber'>
            <h1 class='text-center'>Thank You For Playing</h1>
            <h2>Results:</h2>
            <div class='results-table-container'>
                <table class='results-table'>
                    <tbody>
                        <tr>
                            <td>Total</td>
                            <td>${(document.querySelector('.score').innerHTML)}/${document.querySelector('.question-total').innerHTML}</td>
                            <td>${Math.floor(parseInt(document.querySelector('.score').innerHTML)/parseInt(document.querySelector('.question-total').innerHTML)*100)}%</td>
                        </tr>
    `;

    for (let i in stateNameList) {
        if (states[i].numberOfParks > 0) {
            results += `
                <tr>
                    <td>${getStateFullName(i)}</td>
                    <td>${states[i].correctParks}/${states[i].numberOfParks}</td>
                    <td>${Math.floor(states[i].correctParks/states[i].numberOfParks*100)}%</td>
                </tr>
            `;
        }
    }

    results += `
                    </tbody>
                </table>
            </div>
        </div>
        <div class='flex'>
            <!-- <input class='btn btn-amber-outline btn-restart' type="button" value='Restart' /> -->
            <a class='btn btn-green-outline' href='https://www.nps.gov/learnandexplore/index.htm' target="_blank" rel="noopener noreferrer">EXPLORE</a>
        </div>
    `;

    return results;
}

