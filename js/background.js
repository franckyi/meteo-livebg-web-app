import { PEXELS_APIKEY } from '../js/config.js';

const temp = document.querySelector('.c').textContent;

let queries = {
    winter: ['winter', 'snow', 'ice'],
    spring: ['spring', 'flowers'],
    summer: ['summer', 'summer beach'],
    autumn: ['autumn', 'falling leaves'],
    wind: ['wind'],
    storm: ['strong wind','storm'],
}

function chooseQuery() {

}

let query = 'winter'; // TODO GET RANDOM STRING FROM VOCABULARY BASING ON TEMPERATURE VALUE

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
    let randomIndex = Math.floor( Math.random() * (data.photos.length+1) );
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
