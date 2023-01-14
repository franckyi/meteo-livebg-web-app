import {OPENWEATHER_APIKEY} from './config.js';

// DOM
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
let today = `${currentDate} ${months[currentMonth]} ${currentYear}`;
let time = `${hour}:${minutes}`;
document.getElementById('time').innerHTML = time;
document.getElementById('date').innerHTML = today;

window.addEventListener('load', () => {
    
    // Fetch location only after allowing access to position in the browser 
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (position) => {

            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            const apiByPosition = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`;
            
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
                })
        })

        console.warn( 'fetch location OK' )

    }

    inputCity.addEventListener( 'input', () => {

        console.log(inputCity.value);

        // fetch current input value
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity.value}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`)
        .then( (respons) => response.json() )
        .then( (data) => {
        
        });



    })

    btn.addEventListener( 'click', (e) => {
        e.preventDefault();
        let city = inputCity.value; 
        let lat, lon;
        document.forms[0].reset();
        
        console.warn(`input = ${city}`);

        const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`;
        // const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},{state code},{country code}&appid=${OPENWEATHER_APIKEY}&units=metric`;
        
        // Check data.length
        fetch(apiByCity)
        .then( (response) => response.json() )
        .then( (data) => {
            if (data.length < 2) {
                lat = data[0].lat;
                lon = data[0].lon;

                // console.warn( 'fetch city OK', 'length = ' + data.length, lat,lon )
                // console.info(data);
    
                return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
            } else {

                lat = data[0].lat;
                lon = data[0].lon;
    
                console.warn( 'fetch city OK', 'length = ' + data.length, lat,lon )
                console.info(data);
    
    
                return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
            }
            


        })
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
            });

    });

});