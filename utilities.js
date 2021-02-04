function getNPSData(callback) {
    fetch('nps.json', {
    })
    .then( res => {return res.json()})
    .then( jsonRes => callback(jsonRes));

}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function getStateTwoDigitCode(stateName) {
    return stateAbbrList[capitalize(stateName)];
}

function getStateFullName(stateAbbr) {
    return stateNameList[stateAbbr];
}

function lonLatToXY(longitude, latitude) {
    let westBoundry = -178.206173;
    let eastBoundry = -52.631621;
    let southBoundry = 18.910765;
    let northBoundry = 83.090765;
    let width = 1179//3624;
    let height = 1329//3727;
    let mapLonDelta = eastBoundry - westBoundry;
    let x = (longitude - westBoundry) * (width/mapLonDelta)

    let mapLatBottomDegree = southBoundry * Math.PI / 180;
 
    latitude = latitude * Math.PI / 180;
    let worldMapWidth = ((width / mapLonDelta) * 360) / (2 * Math.PI);
    let mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
    let y = height - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitude)) / (1 - Math.sin(latitude)))) - mapOffsetY);
    y += 0;

    return {x:x, y:y};
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

stateAbbrList = {
    'Arizona': 'AZ',
    'Alabama': 'AL',
    'Alaska':'AK',
    'American Samoa': 'AS',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'District of Columbia': 'DC',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
}

stateNameList = {
    AZ: 'Arizona',
    AL: 'Alabama',
    AK: 'Alaska',
    AS: 'American Samoa',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DC: 'District of Columbia',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VI: 'Virgin Islands',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming' 
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
