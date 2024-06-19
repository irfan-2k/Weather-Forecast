const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityElement = document.querySelector('.weather-box .city');
const forecastDays = document.querySelector('.forecast-days'); // Added line for forecast

const backgroundImages = {
    Clear: 'url(images/clear-bg.jpg)',
    Rain: 'url(images/rain-bg.jpg)',
    Snow: 'url(images/snow-bg.jpg)',
    Clouds: 'url(images/cloud-bg.jpg)',
    Haze: 'url(images/haze-bg.png)',
    Default: 'url(images/bg2.jpg)'
};

// Function to search weather
function searchWeather() {
    const APIKey = '42f64d0889e115454e8f703d2c8f17d7';
    const input = document.querySelector('.search-box input').value;
    let endpoint = '';

    if (input === '')
        return;

    if (isNaN(input)) {
        // Input is city name
        endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${APIKey}`;
    } else {
        // Input is pin code
        endpoint = `https://api.openweathermap.org/data/2.5/weather?zip=${input},IN&units=metric&appid=${APIKey}`;
    }

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(json => {
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            cityElement.textContent = json.name;

            document.body.style.backgroundImage = backgroundImages[json.weather[0].main] || backgroundImages.Default;

            switch (json.weather[0].main) {
                case 'Clear':
                    weatherBox.classList.remove('rain');
                    weatherBox.classList.add('clear');
                    break;
                case 'Clouds':
                    weatherBox.classList.remove('clear');
                    weatherBox.classList.add('cloud');
                    break;
                default:
                    weatherBox.classList.remove('clear', 'rain');
            }

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.jpg';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = 'images/Clear.png';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = 'block';
            weatherDetails.style.display = 'flex';
            container.style.height = 'auto';
        })
        .catch(error => {
            console.error(error);
            container.style.height = 'auto';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');
        });

    // Fetch 5-day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            forecastDays.innerHTML = '';
            for (let i = 0; i < json.list.length; i += 8) {
                const day = json.list[i];
                const date = new Date(day.dt * 1000);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                const icon = day.weather[0].icon;
                const temp = parseInt(day.main.temp);

                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                forecastDay.innerHTML = `
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}">
                    <p>${dayOfWeek}</p>
                    <p>${temp}°C</p>
                `;
                forecastDays.appendChild(forecastDay);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Add event listener for button click and Enter key press
search.addEventListener('click', searchWeather);
document.querySelector('.search-box input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
