const apiKey = "https://api.weatherapi.com/v1/current.json?key=f0aa00597bff4faa925170916251508&q=London&aqi=yes"; // Get from https://openweathermap.org/api

document.getElementById("searchBtn").addEventListener("click", getWeather);

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                alert("City not found!");
                return;
            }

            document.getElementById("temperature").innerHTML = `${data.main.temp}°C`;
            document.getElementById("description").innerHTML = data.weather[0].description;
            document.getElementById("location").innerHTML = `${data.name}, ${data.sys.country}`;

            let iconHTML = "";
            const weatherType = data.weather[0].main.toLowerCase();
            if (weatherType.includes("cloud")) {
                iconHTML = '<i class="fas fa-cloud"></i>';
            } else if (weatherType.includes("rain")) {
                iconHTML = '<i class="fas fa-cloud-showers-heavy"></i>';
            } else if (weatherType.includes("clear")) {
                iconHTML = '<i class="fas fa-sun"></i>';
            } else if (weatherType.includes("snow")) {
                iconHTML = '<i class="fas fa-snowflake"></i>';
            } else {
                iconHTML = '<i class="fas fa-smog"></i>';
            }

            document.getElementById("weatherIcon").innerHTML = iconHTML;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}
