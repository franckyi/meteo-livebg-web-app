const apiKey = 'cda612fc39faed4b537256e2db2f****';

window.addEventListener('load', () => {
    let lat;
    let long;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            lat = position.coords.latitude;
            long = position.coords.longitude;
        })
    }
});