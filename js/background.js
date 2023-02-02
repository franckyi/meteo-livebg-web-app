import { PEXELS_APIKEY } from '../js/config.js';

let temp = localStorage.getItem('temperature');
let description = localStorage.getItem('description');
console.log(`temp: ${temp}`);
console.log(`description: ${description}`);

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

// chooseWord();

export const chooseWord = function () {

        if (temp <= 0) {
            query = queries.cold[ Math.floor( Math.random() * (queries.cold.length+1) ) ];
            // console.log('temp < 0');
        }
        else if (temp >= 22) {
            query = queries.sun[ Math.floor( Math.random() * ((queries.sun.length)+1) ) ];
            // console.log('temp > 22');
        }
        else if (temp > 0 && temp < 22) {
            if (description.includes('wind') ) {
                query = queries.wind[ Math.floor( Math.random() * ((queries.wind.length)+1) ) ];
                // console.log('0 > temp < 22');
            }
            else if (description.includes('rain') ) {
                query = queries.rain[ Math.floor( Math.random() * ((queries.rain.length)+1) ) ];
                // console.log('rain');
            }
            else if (description.includes('clouds') ) {
                query = queries.clouds[ Math.floor( Math.random() * ((queries.clouds.length)+1) ) ];
                // console.log('clouds');
                // console.log(queries.clouds[ Math.floor( Math.random() * ((queries.clouds.length)+1) ) ]);
            }
            else if (description.includes('clear') ) {
                query = queries.clear[ Math.floor( Math.random() * ((queries.clear.length)+1) ) ];
                // console.log('clear');
            }
            else if (description.includes('sun') ) {
                query = queries.sun[ Math.floor( Math.random() * ((queries.sun.length)+1) ) ];
                // console.log('sun');
            }
        }

        console.log('✅ called chooseWord()');
        console.log(`chose word: ${query}`);
        
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
}

function replaceBackground(data) {
    console.log('✅ called replaceBackground()');

    // let portrait = window.matchMedia('orientation: portrait');
    // let landscape = window.matchMedia('orientation: landscape');
    let randomIndex = Math.floor( Math.random() * ((data.photos.length)+1) );
    let imageUrl;

    let h = window.innerHeight;
    let w = window.innerWidth;

    // TODO FIX THESE CONDITIONS OR USE PROMISE
    if (h > w) {
        console.log('is PORTRAIT');
        imageUrl = data.photos[randomIndex].src.portrait;
    }
    else if (h < w) {
        console.log('is LANDSCAPE');
        imageUrl = photoList[randomIndex].src.landscape;
    }
    console.log(imageUrl);
    document.body.style.backgroundImage = 'url(' + imageUrl + ')';
}