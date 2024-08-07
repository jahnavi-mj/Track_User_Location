// Function to initialize the map
function initMap(latitude, longitude) {
    const map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Your Location:<br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
        .openPopup();
}

// Function to get the user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Show the user's location on the map
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    document.getElementById('location-info').innerHTML = `Latitude: ${latitude}, Longitude: ${longitude}`;

    initMap(latitude, longitude);

    // Get the address and weather information
    getAddress(latitude, longitude);
    getWeather(latitude, longitude);
}

// Function to show error if user location cannot be obtained
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Function to get address information using OpenCage Geocoding API
function getAddress(latitude, longitude) {
    const apiKey = '5d9a38ab854444bd99a5aea0f988f4ff'; // Replace with your OpenCage API key
    const addressUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    fetch(addressUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const formattedAddress = result.formatted || "Not Available";
                document.getElementById('location-info').innerHTML += `<br>Address: ${formattedAddress}`;
            } else {
                document.getElementById('location-info').innerHTML += "<br>Address: Not Available";
            }
        })
        .catch(error => {
            console.error("Geocoding API Error:", error);
            document.getElementById('location-info').innerHTML += "<br>Address: Could not retrieve address information.";
        });
}

// Function to get weather information using OpenWeatherMap
function getWeather(latitude, longitude) {
    const apiKey = 'd5e9e2de208bf28266926ed286feb9c8'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Weather API response error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const city = data.name || "Not Available";
            const weatherDescription = data.weather[0].description || "Not Available";
            const temperature = data.main.temp || "Not Available";

            const weatherInfo = `City: ${city}, Weather: ${weatherDescription}, Temperature: ${temperature}°C`;
            document.getElementById("weather-info").innerHTML = weatherInfo;
        })
        .catch(error => {
            console.error("Weather API Error:", error);
            document.getElementById("weather-info").innerHTML = "Could not retrieve weather information.";
        });
}



