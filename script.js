const apiKey = 'af1d95885ac78dbf8e9859caf42e1a26'; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('desc');
const locationEl = document.getElementById('location');
const weatherIcon = document.getElementById('weatherIcon');

function clearIcon() {
  weatherIcon.innerHTML = '';
  weatherIcon.className = 'icon';
}

function createSun() {
  clearIcon();
  const sun = document.createElement('div');
  sun.className = 'sun';
  weatherIcon.appendChild(sun);
}

function createCloud() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  weatherIcon.appendChild(cloud);
}

function createRain() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  weatherIcon.appendChild(cloud);

  for(let i=0; i<3; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    weatherIcon.appendChild(drop);
  }
}

function createSnow() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  weatherIcon.appendChild(cloud);

  for(let i=0; i<3; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    weatherIcon.appendChild(flake);
  }
}

function createThunderstorm() {
  clearIcon();
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  weatherIcon.appendChild(cloud);

  const lightning = document.createElement('div');
  lightning.className = 'lightning';
  weatherIcon.appendChild(lightning);
}

function setBackground(weather) {
  document.body.className = '';
  switch(weather.toLowerCase()) {
    case 'clear':
      document.body.classList.add('clear');
      break;
    case 'clouds':
      document.body.classList.add('clouds');
      break;
    case 'rain':
    case 'drizzle':
      document.body.classList.add('rain');
      break;
    case 'snow':
      document.body.classList.add('snow');
      break;
    case 'thunderstorm':
      document.body.classList.add('thunderstorm');
      break;
    default:
      document.body.style.background = 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)';
  }
}

async function fetchWeather(city) {
  if(!city) {
    alert('Please enter a city name!');
    return;
  }

  try {
    const res = await fetch(https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey});
    if(!res.ok) throw new Error('City not found');

    const data = await res.json();

    tempEl.textContent = ${Math.round(data.main.temp)}°C;
    descEl.textContent = data.weather[0].description;
    locationEl.textContent = ${data.name}, ${data.sys.country};

    setBackground(data.weather[0].main);

    switch(data.weather[0].main.toLowerCase()) {
      case 'clear': createSun(); break;
      case 'clouds': createCloud(); break;
      case 'rain':
      case 'drizzle': createRain(); break;
      case 'snow': createSnow(); break;
      case 'thunderstorm': createThunderstorm(); break;
      default: clearIcon();
    }

    weatherDisplay.style.display = 'flex';

  } catch(err) {
    alert(err.message);
    weatherDisplay.style.display = 'none';
  }
}

searchBtn.addEventListener('click', () => fetchWeather(cityInput.value.trim()));
cityInput.addEventListener('keypress', e => { if(e.key === 'Enter') searchBtn.click(); });

