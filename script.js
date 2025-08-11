const apiKey = "af1d95885ac78dbf8e9859caf42e1a26"; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const locationEl = document.getElementById('location');
const weatherIconEl = document.getElementById('weather-icon');

function clearIcon() {
  weatherIconEl.innerHTML = '';
  weatherIconEl.className = 'icon';
}

function showSun() {
  clearIcon();
  const sun = document.createElement('div');
  sun.classList.add('sun');
  weatherIconEl.appendChild(sun);
}

function showClouds() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  weatherIconEl.appendChild(cloud);
}

function showRain() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  weatherIconEl.appendChild(cloud);

  for(let i = 0; i < 3; i++) {
    const drop = document.createElement('div');
    drop.classList.add('raindrop');
    weatherIconEl.appendChild(drop);
  }
}

function showSnow() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  weatherIconEl.appendChild(cloud);

  for(let i = 0; i < 3; i++) {
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    weatherIconEl.appendChild(flake);
  }
}

function showThunderstorm() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.classList.add('cloud');
  weatherIconEl.appendChild(cloud);

  const lightning = document.createElement('div');
  lightning.classList.add('lightning');
  weatherIconEl.appendChild(lightning);
}

function setBackground(weatherMain) {
  document.body.className = ''; // reset
  switch(weatherMain.toLowerCase()) {
    case 'clear': document.body.classList.add('clear'); break;
    case 'clouds': document.body.classList.add('clouds'); break;
    case 'rain':
    case 'drizzle': document.body.classList.add('rain'); break;
    case 'snow': document.body.classList.add('snow'); break;
    case 'thunderstorm': document.body.classList.add('thunderstorm'); break;
    default: document.body.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  }
}

async function fetchWeather(city) {
  if (!city) {
    alert('Please enter a city name');
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) throw new Error('City not found');

    const data = await response.json();

    temperatureEl.textContent = ${Math.round(data.main.temp)}°C;
    descriptionEl.textContent = data.weather[0].description;
    locationEl.textContent = ${data.name}, ${data.sys.country};

    setBackground(data.weather[0].main);

    switch (data.weather[0].main.toLowerCase()) {
      case 'clear':
        showSun();
        break;
      case 'clouds':
        showClouds();
        break;
      case 'rain':
      case 'drizzle':
        showRain();
        break;
      case 'snow':
        showSnow();
        break;
      case 'thunderstorm':
        showThunderstorm();
        break;
      default:
        clearIcon();
    }

    weatherInfo.style.display = 'flex';
  } catch (error) {
    alert(error.message);
    weatherInfo.style.display = 'none';
  }
}

searchBtn.addEventListener('click', () => {
  fetchWeather(cityInput.value.trim());
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});