"use strict";

import { OPENWEATHER_APIKEY } from '../js/config.js';
import { chooseWord } from '../js/background.js';

const tempC = document.querySelector('.c');
const desc = document.querySelector('.desc');
const iconHTML = document.getElementById('weather-icon');
const loc = document.querySelector('.location');
const tempFeel = document.getElementById('feel');
const tempMin = document.querySelector('.min');
const press = document.querySelector('.pressure');
const humid = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind');
const tempMax = document.querySelector('.max');
const sunriseHTML = document.querySelector('.sunrise');
const sunsetHTML = document.querySelector('.sunset');
const form = document.getElementById('form');
const inputCity = document.getElementById('input-city');
const btn = document.getElementById('btn');
let datalist = document.createElement('datalist');
let temp = null;
let description = null;
let results = [];
let requestedLocation = {
    name: null,
    state: null,
    country: null,
    lat: null,
    lon: null,
} 
let capturedOptions = [];

function displayTime() {
    const time = document.getElementById('time');
    const today = document.getElementById('date');
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
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    time.innerHTML = `${hour}:${minutes},`;
    today.innerHTML = `${currentDate} ${months[currentMonth]}`;
}

const updateData = data => {
    let location = data.name;
    let { icon } = data.weather[0];
    temp = data.main.temp;
    description = data.weather[0].description;
    let { feels_like, temp_min, temp_max, pressure, humidity } = data.main;
    let { speed } = data.wind;
    let { sunrise, sunset } = data.sys;
    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    let sunriseGMT = new Date(sunrise * 1000);
    let sunsetGMT = new Date(sunset * 1000);
    iconHTML.src = iconUrl;
    loc.textContent = `${location}`;
    desc.textContent = `${description}`;
    tempC.textContent = `${temp.toFixed(1)} °C`;

    if (temp > 20) {
        tempC.classList.remove('cold');
        tempC.classList.add('hot');
    } else if (temp < 6) {
        tempC.classList.remove('hot');
        tempC.classList.add('cold');
    } else {
        tempC.classList.remove('hot');
        tempC.classList.remove('cold');
    }

    tempFeel.textContent = `${feels_like.toFixed(1)} °C`;
    tempMin.textContent = `min ${temp_min.toFixed(1)} °C`;
    tempMax.textContent = `max ${temp_max.toFixed(1)} °C`;
    press.textContent = pressure;
    humid.textContent = `${humidity}`;
    windSpeed.textContent = `${speed}`;
    sunriseHTML.textContent = `${sunriseGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
    sunsetHTML.textContent = `${sunsetGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
    chooseWord(temp, description);
}

const fetchCurrentCoords = URL => {
    fetch(URL).then( resp => resp.json() )
        .then( data => {
        updateData(data);
    });
}

const getCoords = () => {
    navigator.geolocation.getCurrentPosition( position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        fetchCurrentCoords(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
    })
}

const fetchQuery = query => {
    query = inputCity.value;
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`)
    .then( resp => resp.json() ).then( data => {
        if (data.length > 0) {
            data.forEach( d => { capturedOptions.push(d) } );
            displayOptionsHTML(data);
        }
    });
}

const displayOptionsHTML = data => {
    if (data.length === 1) {
        let option = document.createElement('option');
        datalist.appendChild(option);
        option.setAttribute('value', `${data[0].name ?? ''} ${data[0].state ?? ''} ${data[0].country ?? ''}`);
    }
    else if (data.length > 1) {
        data.forEach( city => {        
            results.push(city);
        });

        results.forEach( result => {
            let option = document.createElement('option');
            requestedLocation.name = result.name ?? result.city;
            requestedLocation.lat = result.lat ?? '';
            requestedLocation.lon = result.lon ?? '';
            requestedLocation.state = result.state ?? '';
            requestedLocation.country = result.country ?? '';
            option.setAttribute('value', `${requestedLocation.name} ${requestedLocation.state} ${requestedLocation.country}`);
            datalist.appendChild(option);
        });
    }
}

const freezeCurrentOptions = regex => {
    capturedOptions.forEach( o => {
        const current = `${o.name} ${o.state} ${o.country}`;
        if ( current.toLowerCase().includes(regex) ) {
            let lat = o.lat;
            let lon = o.lon;
            fetchCurrentCoords(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
        }
    });
    capturedOptions = [];
}

document.addEventListener( "DOMContentLoaded", () => {
    displayTime();

    if (navigator.geolocation) {
        getCoords();
    }

    inputCity.addEventListener( 'input', () => {
        results = [];
        let regex = inputCity.value.toLowerCase().replaceAll('  ',' ').trim();
        freezeCurrentOptions(regex);
        form.appendChild(datalist);
        datalist.innerHTML = "";
        datalist.setAttribute('id', 'results');
        requestedLocation.name = inputCity.value;
        fetchQuery(requestedLocation);
    });
    
    btn.addEventListener( 'click', e => {
        e.preventDefault();
        inputCity.value = '';
    });
    
});