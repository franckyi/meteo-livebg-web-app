const apiKey = 'cda612fc39faed4b537256e2db2f****';

window.addEventListener('load', () => {
    let lat;
    let long;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const apiBase = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
            console.log(apiBase);
            fetch(apiBase)
                .then( (response) => response.json() )
                .then( (data) => {
                    const location = data.name;
                    const {temp} = data.main;
                    const {description, icon} = data.weather[0];
                    const {sunrise, sunset} = data.sys;
                    console.log(description);
                })
        })
    }



});