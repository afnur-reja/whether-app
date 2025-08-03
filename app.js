const cityName = document.querySelector('#city-name');
const search = document.querySelector('#search');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temp');
const city = document.querySelector('.city');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind');

const API_KEY = "c334edcac4913d646a0f3500ab778e0b";
const url = `https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_KEY}&units=metric`