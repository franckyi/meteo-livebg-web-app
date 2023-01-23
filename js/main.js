import { OPENWEATHER_APIKEY } from '../js/config.js';

window.addEventListener('load', () => {

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
    let requestedLocation = {
        name: undefined,
        state: undefined,
        country: undefined,
        lat: undefined,
        lon: undefined,
    } 
    let capturedOptions = [];

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

    const updateData = function(data) {
        let location = data.name;
        let {temp, temp_min, temp_max} = data.main;
        let {description, icon} = data.weather[0];
        let {sunrise, sunset} = data.sys;
        let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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
        console.log( '✅ update data OK' )
    }

    const fetchPosition = function(useLatLon) {
        fetch(useLatLon)
        .then( resp => resp.json() ).then( data => {
            console.log( '✅ fetch position OK' )
            updateData(data);
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (position) => {
            requestedLocation.lat = position.coords.latitude;
            requestedLocation.lon = position.coords.longitude;
            fetchPosition(`https://api.openweathermap.org/data/2.5/weather?lat=${requestedLocation.lat}&lon=${requestedLocation.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
        })
    }

    const fetchQuery = function(requestedLocation) {
        requestedLocation.name = inputCity.value;
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${requestedLocation.name}&limit=5&appid=${OPENWEATHER_APIKEY}&units=metric`)
        .then( resp => resp.json() ).then( data => {

            data.forEach( d => { capturedOptions.push(d) } );
            displayOptionsHTML(data);
        });
    }

    const displayOptionsHTML = data => {
        if (data.length == 1) {
            let option = document.createElement('option');
            datalist.appendChild(option);
            option.setAttribute('value', `${data[0].name ?? ''} ${data[0].state ?? ''} ${data[0].country ?? ''}`);
        }
        else if (data.length > 1) {
            data.forEach( city => {        
                Results.push(city);
            });

            Results.forEach( result => {
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

    const freezeCurrentOptions = (regex) => {
        capturedOptions.forEach( o => {
            const current = `${o.name} ${o.state} ${o.country}`;
            if ( current.toLowerCase().includes(regex) ) {
                requestedLocation.lat = o.lat;
                requestedLocation.lon = o.lon;
                fetchPosition(`https://api.openweathermap.org/data/2.5/weather?lat=${requestedLocation.lat}&lon=${requestedLocation.lon}&appid=${OPENWEATHER_APIKEY}&units=metric`);
            }
        })
        capturedOptions = [];
    }

    inputCity.addEventListener( 'input', () => {
        Results = [];
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