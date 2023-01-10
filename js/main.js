import {OPENWEATHER_APIKEY} from './config.js';

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
let today = `${currentDate} ${months[currentMonth]} ${currentYear}`;
let time = `${hour}:${minutes}`;

document.getElementById('time').innerHTML = time;
document.getElementById('date').innerHTML = today;

window.addEventListener('load', () => {
    let lat;
    let long;
    let city;

    btn.addEventListener( 'click', (e) => {
        e.preventDefault();
        city = inputCity.value; 
        document.forms[0].reset();
        console.warn(`city = ${city}`);

        const apiGeocoding = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${OPENWEATHER_APIKEY}&units=metric`;
        // const apiGeocoding = `http://api.openweathermap.org/geo/1.0/direct?q=${city},{state code},{country code}&appid=${OPENWEATHER_APIKEY}&units=metric`;
        fetch(apiGeocoding)
            .then( (response) => response.json() )
            .then( (data) => {
                console.log(data[0].name)
            });

    });

    // Fetch location only after allowing access to position in the browser 
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const apiWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${OPENWEATHER_APIKEY}&units=metric`;
        
            fetch(apiWeather)
            .then( (response) => response.json() )
            .then( (data) => {
                const location = data.name;
                const {temp, temp_min, temp_max} = data.main;
                const {description, icon} = data.weather[0];
                const {sunrise, sunset} = data.sys;
                const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                const sunriseGMT = new Date(sunrise * 1000);
                const sunsetGMT = new Date(sunset * 1000);
                iconHTML.src = iconUrl;
                loc.textContent = `${location}`;
                desc.textContent = `${description}`;
                tempC.textContent = `${temp.toFixed(1)} °C`;
                tempMin.textContent = `min ${temp_min.toFixed(1)} °C`;
                tempMax.textContent = `max ${temp_max.toFixed(1)} °C`;
                sunriseHTML.textContent = `${sunriseGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
                sunsetHTML.textContent = `${sunsetGMT.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'} )}`;
            })

        })
    }





});