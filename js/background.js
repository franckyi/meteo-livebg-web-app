import { PEXELS_APIKEY } from '../js/config.js';
// import { temperature } from '../js/main.js';
// console.log(temperature);

// import {test} from '../js/main.js';
// console.log(test);

// import {passTempValue} from '../js/main.js';
// console.log(passTempValue);


let query;
let queries = {
    cold: ['winter', 'snow', 'ice'], // UNDER 0^
    wind: ['wind', 'strong wind'],
    rain: ['rain', 'rain forest', 'rainy', 'raining', 'rainbow'],
    clouds: ['cloudy', 'cloudy sky'],
    sun: ['sun', 'sunny', 'sunny forest'],
    hot: ['summer', 'summer beach', 'spring', 'flowers'], // OVER 25^
}

function chooseQuery() {
    // let temp = document.querySelector('.c').textContent.replace('°C','').trim();
    // let desc = document.querySelector('.desc').textContent.replace('°C','').trim();
    // console.warn('temp');
    // console.log(temp);
    // console.warn('desc');
    // console.log(desc);
    // function choose() {
        // if (temp < 0) {
        //     query = queries.cold[ Math.floor( Math.random() * (queries.cold.length+1) ) ];
        //     console.log(query);
        // }
        // else if (temp > 25) {
        //     query = queries.sun[ Math.floor( Math.random() * ((queries.sun.length)+1) ) ];
        //     console.log(query);
        // }
        // else if (temp >= 0 && temp <= 25) {
        //     if (desc.includes('wind') ) {
        //         query = queries.wind[ Math.floor( Math.random * ((queries.wind.length)+1) ) ];
        //         console.log(query);
        //     }
        //     else if (desc.includes('rain') ) {
        //         query = queries.rain[ Math.floor( Math.random * ((queries.rain.length)+1) ) ];
        //         console.log(query);
        //     }
        //     else if (desc.includes('clouds') ) {
        //         query = queries.clouds[ Math.floor( Math.random * ((queries.clouds.length)+1) ) ];
        //         console.log(query);
        //     }
        //     else if (desc.includes('sun') ) {
        //         query = queries.sun[ Math.floor( Math.random * ((queries.sun.length)+1) ) ];
        //         console.log(query);
        //     }
        // }
        // console.log('test');
}

console.warn('query');
console.log(query);

chooseQuery();

fetch(`https://api.pexels.com/v1/search?query=${query}`,
{ headers: { Authorization: PEXELS_APIKEY } } )
.then( resp => resp.json() )
.then( data => {
    console.log(data.photos);
    getImage(data);
})
.catch(document.body.style.backgroundColor = '#ADD8E6'); // FALLBACK COLOR

function getImage(data) {
    let portrait = window.matchMedia('orientation: portrait');
    let landscape = window.matchMedia('orientation: landscape');
    let randomIndex = Math.floor( Math.random() * ((data.photos.length)+1) );
    let imageUrl;

    if (portrait) {
        console.log('is PORTRAIT');
        imageUrl = data.photos[randomIndex].src.portrait;
    }
    else if (landscape) {
        console.log('is LANDSCAPE');
        imageUrl = photoList[randomIndex].src.landscape;
    }
    document.body.style.backgroundImage = 'url(' + imageUrl + ')';
}
