import {OPENWEATHER_APIKEY} from '../js/config.js';

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
let datalist = document.createElement('datalist');
let Results = [];
let city;
let state;
let country;
let lat;
let lon;
let passedVals = [];
let cityIndex;
let entered;

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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (position) => {

            lat = position.coords.latitude;
            lon = position.coords.longitude;
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

    // ENTER CHARACTER
    inputCity.addEventListener( 'input', () => { 
        Results = [];

        form.appendChild(datalist);
        datalist.innerHTML = "";   
        datalist.setAttribute('id', 'results');

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity.value}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`)
        .then( (response) => response.json() )
        .then( (data) => {

            if (data.length > 0 && data.length < 2) {
                let option = document.createElement('option');
                datalist.appendChild(option);
                // console.log(`${data[0].name ?? ''} ${data[0].state ?? ''} ${data[0].country ?? ''}`);
                option.setAttribute('value', `${data[0].name ?? ''} ${data[0].state ?? ''} ${data[0].country ?? ''}`);
            }

            else if (data.length >= 2) {   

                // CREATE RESULTS ARRAY
                data.forEach( city => {        
                    if (city.name.length == inputCity.value.length && city.name.toLowerCase().includes( inputCity.value.toLowerCase() )) {
                        Results.push(city);
                    }
                });
                                
                // CREATE OPTIONS IN HTML
                Results.forEach( (result) => {
                    let option = document.createElement('option');
                    city = result.name ?? '';
                    state = result.state ?? '';
                    country = result.country ?? '';
                    option.setAttribute('value', `${city} ${state} ${country}`);
                    datalist.appendChild(option);
                });
                
            }
        
        });
    });

    // CONFIRM INPUT VALUE
    btn.addEventListener( 'click', (e) => {
        e.preventDefault();

        for (let i = 0; i < datalist.childNodes.length; i++) {
            console.warn(datalist.childNodes[i].value);
            passedVals.push(datalist.childNodes[i].value);
        }

        datalist.innerHTML = "";
        entered = inputCity.value.replaceAll('  ', ' '); 
        document.forms[0].reset();

        console.warn(`entered = ${entered}`);
    
        for (let i = 0; i < passedVals.length; i++) {
            if (passedVals[i] == entered) {
                console.warn('MATCHED INPUT!!')
                cityIndex = i;
            }
        }

        // const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`;
        const apiByCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&${state}&${country}&appid=${OPENWEATHER_APIKEY}&units=metric`;
        
        fetch(apiByCity)
        .then( (response) => response.json() )
        .then( (data) => {

            console.warn( 'TEST data=' )
            console.log(data)

            if (data.length > 0 && data.length < 2) {
                lat = data[0].lat;
                lon = data[0].lon;
                return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
            } 

            else if (data.length > 1) {
                
                for (let i = 0; i < data.length; i++) {
                    console.warn('iteration');
                    if (`${data[i].name} ${data[i].state} ${data[i].country}` === entered ) {
                        console.log('MATCH');
                        cityIndex = i;
                    }
                }
                
                lat = data[cityIndex].lat;
                lon = data[cityIndex].lon;

                console.log(data[cityIndex].lat);
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