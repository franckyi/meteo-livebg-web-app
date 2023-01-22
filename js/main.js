import {OPENWEATHER_APIKEY} from '../js/config.js';

window.addEventListener('load', () => {


// DOM
const form = document.getElementById('form');
const inputCity = document.getElementById('input-city');
const btn = document.getElementById('btn');
const iconHTML = document.getElementById('weather-icon');
const loc = document.querySelector('.location');
const desc = document.querySelector('.desc');
const tempC = document.querySelector('.c');
const tempMin = document.querySelector('.min');
const tempMax = document.querySelector('.max');
const sunriseHTML = document.querySelector('.sunrise');
const sunsetHTML = document.querySelector('.sunset');
let regex;

let datalist = document.createElement('datalist');
let Results = [];
let options = [];
let cityIndex;
let queryPosition = {
    name: undefined,
    state: undefined,
    country: undefined,
    lat: undefined,
    lon: undefined,
} 
let optionsCaptured = [];

// MANAGE DATE & TIME
let currentDate = new Date().getDate();
let currentMonth = new Date().getMonth();
let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
let currentYear = new Date().getFullYear();
let hour = new Date().getHours();
let minutes = new Date().getMinutes();
minutes = minutes < 10 ? `0${minutes}` : minutes;
const time = document.getElementById('time');
const today = document.getElementById('date');
time.innerHTML = `${hour}:${minutes}`;
today.innerHTML = `${currentDate} ${months[currentMonth]} ${currentYear}`;

const fetchPosition = function(apiByPosition) {
    fetch(apiByPosition)
    .then( (response) => response.json() )
    .then( (data) => {
        let location = data.name;
        let {temp, temp_min, temp_max} = data.main;
        let {description, icon} = data.weather[0];
        let {sunrise, sunset} = data.sys;
        let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        let sunriseGMT = new Date(sunrise * 1000);
        let sunsetGMT = new Date(sunset * 1000);
        iconHTML.src = iconUrl;
        loc.textContent = `${location}`;
        desc.textContent = `${description}`;
        tempC.textContent = `${temp.toFixed(1)} °C`;
        tempMin.textContent = `min ${temp_min.toFixed(1)} °C`;
        tempMax.textContent = `max ${temp_max.toFixed(1)} °C`;
        sunriseHTML.textContent = `${sunriseGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
        sunsetHTML.textContent = `${sunsetGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
        }
    );
}
// FETCH BY LOCATION 
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( (position) => {
        queryPosition.lat = position.coords.latitude;
        queryPosition.lon = position.coords.longitude;
        fetchPosition(`https://api.openweathermap.org/data/2.5/weather?lat=${queryPosition.lat}&lon=${queryPosition.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
    })
    console.warn( 'fetch position SUCCESS' )
}

const fetchInput = function(queryPosition) {
    queryPosition.name = inputCity.value;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${queryPosition.name}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`)
    .then( (response) => response.json() )
    .then( (data) => {
        // console.warn('queryPosition');
        // console.log(queryPosition);

        data.forEach( d => { optionsCaptured.push(d) } );
        // console.warn('data');
        // console.log(data);

        if (data.length == 1) {
            let option = document.createElement('option');
            datalist.appendChild(option);
            option.setAttribute('value', `${data[0].name ?? ''} ${data[0].state ?? ''} ${data[0].country ?? ''}`);
        }

        else if (data.length > 1) {
            // CREATE ARRAY OF RESULTS
            data.forEach( city => {        
                Results.push(city);
            });
                            
            // CREATE OPTIONS IN HTML
            Results.forEach( (result) => {
                let option = document.createElement('option');
                queryPosition.city = result.name ?? '';
                queryPosition.lat = result.lat ?? '';
                queryPosition.lon = result.lon ?? '';
                queryPosition.state = result.state ?? '';
                queryPosition.country = result.country ?? '';
                option.setAttribute('value', `${queryPosition.name} ${queryPosition.state} ${queryPosition.country}`);
                datalist.appendChild(option);
            });
        }
    });
}

// UPDATE INPUT VALUE WHEN TYPING
inputCity.addEventListener( 'input', () => {
    Results = [];

    // BEFORE EMPTY GET LAST VAL OF MATCHED OPTION
    regex = inputCity.value.toLowerCase().replaceAll('  ',' ');
    // console.warn('regex');
    // console.log(regex);

    optionsCaptured.forEach( o => {   
        
        // console.warn('optionsCaptured BEFORE GETTING VAL');
        // console.log(optionsCaptured);

        const current = `${o.name} ${o.state} ${o.country}`;
        // console.warn('current.toLowerCase()');
        // console.log(current.toLowerCase());

        if ( current.toLowerCase().includes(regex) ) {
            queryPosition.lat = o.lat;
            queryPosition.lon = o.lon;
            fetchPosition(`https://api.openweathermap.org/data/2.5/weather?lat=${queryPosition.lat}&lon=${queryPosition.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
        }
    })

    // console.warn('queryPosition');
    // console.log(queryPosition);

    optionsCaptured = [];
    form.appendChild(datalist);
    datalist.innerHTML = "";   
    datalist.setAttribute('id', 'results');
    queryPosition.name = inputCity.value;
    fetchInput(queryPosition);
});

// CONFIRM CURRENT INPUT VALUE
btn.addEventListener( 'click', (e) => {
    e.preventDefault();
    // PASS VALS
    for (let i = 0; i < datalist.childNodes.length; i++) {
        console.warn('options');
        console.log(datalist.childNodes[i].value);
        console.log(datalist);
        options.push(datalist.childNodes[i].value);
    }

    // datalist.innerHTML = "";
    queryPosition.name = inputCity.value.replaceAll('  ', ' ').trim(); 
    document.forms[0].reset();

    console.warn(`entered = ${inputqueryPosition.name}`);

    // GET SELECTED OPTION HERE
    for (let i = 0; i < options.length; i++) {
        if (options[i].toLowerCase().includes(regex)) {
            cityIndex = i;
        }
    }
    datalist.innerHTML = "";

    // SIMPLE SEARCH const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`;
    // fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${queryPosition.name}&limit=5&${queryPosition.state}&${queryPosition.country}&appid=${OPENWEATHER_APIKEY}&units=metric`)
    // .then( (response) => response.json() )
    // .then( (data) => {

    //     if (data.length > 0 && data.length < 2) {
    //         queryPosition.lat = data[0].lat;
    //         queryPosition.lon = data[0].lon;
    //         return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${queryPosition.lat}&lon=${queryPosition.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
    //     } 

    //     else if (data.length > 1) {
            
    //         for (let i = 0; i < data.length; i++) {
    //             if (`${data[i].name} ${data[i].state} ${data[i].country}` === queryPosition.name ) {
    //                 cityIndex = i;
    //             }
    //         }
            
    //         queryPosition.lat = data[cityIndex].lat;
    //         queryPosition.lon = data[cityIndex].lon;

    //         console.log(data[cityIndex].lat);
    //         console.warn( 'fetch city OK', 'length = ' + data.length, queryPosition.lat, queryPosition.lon )
    //         console.info(data);

    //         return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${queryPosition.lat}&lon=${queryPosition.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
    //     }

    // })
    // .then( (response) => response.json() )
    // .then( (data) => {
    //     let location = data.name;
    //     let {temp, temp_min, temp_max} = data.main;
    //     let {description, icon} = data.weather[0];
    //     let {sunrise, sunset} = data.sys;
    //     let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    //     let sunriseGMT = new Date(sunrise * 1000);
    //     let sunsetGMT = new Date(sunset * 1000);
    //     iconHTML.src = iconUrl;
    //     loc.textContent = `${location}`;
    //     desc.textContent = `${description}`;
    //     tempC.textContent = `${temp.toFixed(1)} °C`;
    //     tempMin.textContent = `min ${temp_min.toFixed(1)} °C`;
    //     tempMax.textContent = `max ${temp_max.toFixed(1)} °C`;
    //     sunriseHTML.textContent = `${sunriseGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
    //     sunsetHTML.textContent = `${sunsetGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
    // });

});

});