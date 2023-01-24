import { PEXELS_APIKEY } from '../js/config.js';

let query = 'winter';
let image = '';
let color, orientation;

fetch(`https://api.pexels.com/v1/search?query=${query}`, { headers: { Authorization: PEXELS_APIKEY } })
.then( resp => resp.json() ).then( data => {
    console.log(data.photos[0].src.landscape); // TODO GET RANDOM IMAGE
    image = data.photos[0].src.landscape;  // and ORIENTATION FROM DEVICE
    document.body.style.backgroundImage = 'url(' + image + ')';
});

// console.log(image);



// OLD WAY SAMPLE WORKS
// let mood = 'winter';
// async function pairBackground(mood) {
//     const data = await fetch(`https://api.pexels.com/v1/search?query=${mood}`,
//     {
//         method: "GET",
//         headers: {
//             Accept: "application/json",
//             Authorization: PEXELS_APIKEY,
//         }
//     });
//     const response = await data.json();
//     console.warn(response);
// }

// pairBackground('winter')