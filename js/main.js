// import {OPENWEATHER_APIKEY} from './config.js';

const iconHTML = document.getElementById('weather-icon');
const loc = document.querySelector('.location');
const desc = document.querySelector('.desc');
const tempC = document.querySelector('.c');
const tempMin = document.querySelector('.min');
const tempMax = document.querySelector('.max');
const sunriseHTML = document.querySelector('.sunrise');
const sunsetHTML = document.querySelector('.sunset');
const currentDate = new Date().getDate();
const currentMonth = new Date().getMonth();
const months = [
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
const currentYear = new Date().getFullYear();
const hour = new Date().getHours();
const minutes = new Date().getMinutes();
const today = `${currentDate} ${months[currentMonth]} ${currentYear}`;
const time = `${hour}:${minutes}`;

document.getElementById('time').innerHTML = time;
document.getElementById('date').innerHTML = today;

window.addEventListener('load', () => {
    let lat;
    let long;
    // Infos are displayed only if allowed by browser
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            // console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const apiBase = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${OPENWEATHER_APIKEY}&units=metric`;

            fetch(apiBase)
                .then( (response) => {
                    return response.json();
                })
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