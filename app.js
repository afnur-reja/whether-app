const weatherDiv = document.querySelector('.weather')
const details = document.querySelector('.details')
const cityNameInput = document.querySelector('#city-name');
const search = document.querySelector('#search');
const weatherIcon = document.querySelector('.weather-icon img');
const temperature = document.querySelector('.temp');
const cityName = document.querySelector('.city');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind');

const API_KEY = "Your API key.";

const setResult = (set, info = {}) => {
    if(set) {
        console.log(info)
        weatherDiv.classList.remove('hide-weather');
        details.classList.remove('hide-details')
        cityName.innerHTML = info.city;
        weatherIcon.src = `https://openweathermap.org/img/wn/${info.weatherIconVal}@2x.png`
        temperature.innerHTML = info.temp + '°C';
        humidity.innerHTML = info.humidityVal + '%';
        windSpeed.innerHTML = info.windSpeedVal + ' km/h';
    }  else {
        weatherDiv.classList.remove('hide-weather');
        details.classList.add('hide-details')
        cityName.innerHTML = '';
        weatherIcon.src = ''
        temperature.innerHTML = '';
        humidity.innerHTML = '';
        windSpeed.innerHTML = '';
    }
}

const resultData = (data) => {
        const city = data.name;
        const weatherIconVal = data.weather[0]?.icon;
        const temp = Math.round(data.main?.temp);
        const humidityVal = Math.round(data.main?.humidity);
        const windSpeedVal = (data.wind?.speed * 3.6).toFixed(1);
        const cod = data.cod;
        return { city , weatherIconVal, temp, humidityVal, windSpeedVal};
}

async function showResult(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const data =  await (await fetch(url)).json();
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        const info = resultData(data)
        setResult(true, info)
        
    } catch (err) {
        setResult(false)
        cityName.innerHTML = "City not found";
    }
}

search.addEventListener('click', () => {
    if (!cityNameInput.value) {
        alert('Please enter a city name.')
        setResult(false)
    } else {
        showResult(cityNameInput.value);
    }

})

cityNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search.click();
    }
});



function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
             if (data.cod !== 200) {
                throw new Error(data.message);
            }
            const info = resultData(data);
            setResult(true, info);
        })
        .catch(err => {
            console.error("Error fetching weather by location:", err);
            setResult(false);
            cityName.innerHTML = "Location not found";
        });
}

// Auto-detect location on load
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            getWeatherByCoords(lat, lon);
        },
        (err) => {
            console.error("Geolocation error:", err);
            // Optional: default to a city
            showResult("London");
        }
    );
} else {
    console.log("Geolocation not supported");
    showResult("London"); // fallback city
}
