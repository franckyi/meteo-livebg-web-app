import { PEXELS_APIKEY } from '../js/config.js';

let temp = localStorage.getItem('temperature');
let desc = localStorage.getItem('description');
console.log(`temp: ${temp}`);
console.log(`desc: ${desc}`);

let queries = {
    cold: ['winter', 'snow', 'snow forest', 'winter nature'], // UNDER 0^
    wind: ['wind', 'strong wind'],
    rain: ['rain', 'rain forest', 'rainy', 'raining', 'rainbow'],
    clouds: ['cloudy', 'cloudy sky', 'clouds mountains'],
    clear: ['clear', 'clear sky'],
    sun: ['sun', 'sunny', 'sunny forest'],
    hot: ['summer', 'summer beach', 'spring', 'flowers'], // OVER 22^
}

let query;

chooseQuery();

export function chooseQuery() {

        if (temp <= 0) {
            query = queries.cold[ Math.floor( Math.random() * (queries.cold.length+1) ) ];
            console.log('temp < 0');
        }
        else if (temp >= 22) {
            query = queries.sun[ Math.floor( Math.random() * ((queries.sun.length)+1) ) ];
            console.log('temp > 22');
        }
        else if (temp > 0 && temp < 22) {
            if (desc.includes('wind') ) {
                query = queries.wind[ Math.floor( Math.random() * ((queries.wind.length)+1) ) ];
                console.log('0 > temp < 22');
            }
            else if (desc.includes('rain') ) {
                query = queries.rain[ Math.floor( Math.random() * ((queries.rain.length)+1) ) ];
                console.log('rain');
            }
            else if (desc.includes('clouds') ) {
                query = queries.clouds[ Math.floor( Math.random() * ((queries.clouds.length)+1) ) ];
                console.log('clouds');
                console.log(queries.clouds[ Math.floor( Math.random() * ((queries.clouds.length)+1) ) ]);
            }
            else if (desc.includes('clear') ) {
                query = queries.clear[ Math.floor( Math.random() * ((queries.clear.length)+1) ) ];
                console.log('clear');
            }
            else if (desc.includes('sun') ) {
                query = queries.sun[ Math.floor( Math.random() * ((queries.sun.length)+1) ) ];
                console.log('sun');
            }
        }

        console.log('✅ called chooseQuery()');
        console.log(`query: ${query}`);
        
        fetchImage();
}

function fetchImage() {
    console.log('✅ called fetchImage()');

    fetch(`https://api.pexels.com/v1/search?query=${query}`,
    { headers: { Authorization: PEXELS_APIKEY } } )
    .then( resp => resp.json() )
    .then( data => {
        console.log(data.photos);
        replaceBackground(data);
    })
    // .catch(document.body.style.backgroundColor = '#ADD8E6'); // FALLBACK COLOR
}

function replaceBackground(data) {
    console.log('✅ called replaceBackground()');

    let portrait = window.matchMedia('orientation: portrait');
    let landscape = window.matchMedia('orientation: landscape');
    let randomIndex = Math.floor( Math.random() * ((data.photos.length)+1) );
    let imageUrl;

    // TODO FIX THESE CONDITIONS OR USE PROMISE
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