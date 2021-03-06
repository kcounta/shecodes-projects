let apiURL = "https://api.openweathermap.org/data/2.5/weather";
let apiForecastURL = "https://api.openweathermap.org/data/2.5/forecast";
let apiKEY = "2c7be81cdfd4348e785209fd2490e8d1";

//SEARCH
function searchCity(event) {
  let cityEntry = document.querySelector("#city-input").value;

  event.preventDefault();

  if (cityEntry) {
    axios
      .all([
        axios.get(`${apiURL}?q=${cityEntry}&units=metric&appid=${apiKEY}`),
        axios.get(
          `${apiForecastURL}?q=${cityEntry}&units=metric&appid=${apiKEY}`
        ),
      ])
      .then(
        axios.spread((current, forecast) => {
          getCityDetails(current);
          getForecastDetails(forecast);
        })
      );
  } else {
    alert("Please enter a city");
  }
}

function getForecastDetails(response) {
  let forecastContainer = document.querySelector(".weather.forecast");
  forecastContainer.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    let forecast = response.data.list[index];

      forecastContainer.innerHTML += `
      <div class="weather-info">
        <ul>
          <li class="hour">
            ${getFormattedHours((forecast.dt)*1000)}
          </li>
          <li class="icon">
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
          </li>
          <li>
            <span class="max">
              ${Math.round(forecast.main.temp_max)}°
              </span>
            <span class="min">
              ${Math.round(forecast.main.temp_min)}°
            </span>
          </li>
        </ul>
      </div>
  `;

  }
}

//CITY INFORMATION
function getCityDetails(response) {

  let cityWrapper = document.querySelector(".wrapper");
  cityWrapper.style.visibility = "visible";

  let cityName = document.querySelector("#city");
  cityName.innerHTML = response.data.name;

  let cityDesc = document.querySelector("#description");
  cityDesc.innerHTML = response.data.weather[0].description;

  let cityTempIcon = document.querySelector("#temp-icon");
  cityTempIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  cityTempIcon.setAttribute("alt", response.data.weather[0].description);

  let cityTemp = document.querySelector("#temperature");

  let cityTempCelsius = Math.round(response.data.main.temp);
  let cityTempFahrenheit = Math.round((`${cityTempCelsius}` * 9) / 5 + 32);

  cityTemp.innerHTML = `<div class="celsius-value">${cityTempCelsius}</div><div class="fahr-value hidden">${cityTempFahrenheit}</div>`;

  let cityHumidity = document.querySelector("#humidity");
  cityHumidity.innerHTML = `Humidity: ${Math.round(
    response.data.main.humidity
  )}%`;

  let citywindSpeed = document.querySelector("#wind");
  citywindSpeed.innerHTML = `Wind: ${Math.round(response.data.wind.speed)}km/h`;

  let cityDate = document.querySelector("#date");
  cityDate.innerHTML = getFormattedDate(response.data.timezone * 1000);

  tempConversion();
}

let searchForm = document.querySelector("#weather-form");
searchForm.addEventListener("submit", searchCity);

function getFormattedHours(timestamp){
  let cDate = new Date(timestamp);

  let hours = cDate.getHours();
  let mins = cDate.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }

  return `${hours}:${mins}`;

}

//DATE
function getFormattedDate(timestamp) {
  let cDate = new Date(timestamp);
  let wDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let wDay = wDays[cDate.getDay()];
  
  return `${wDay} ${getFormattedHours(timestamp)}`;
}

//TEMP CONVERSION
function tempConversion() {
  let celsiusElement = document.querySelector(".celsius-value");
  let fahrElement = document.querySelector(".fahr-value");

  function showFahrenheitValue(event) {
    event.preventDefault();
    celsiusElement.classList.add("hidden");
    fahrElement.classList.remove("hidden");
  }

  function showCelsiusValue(event) {
    event.preventDefault();
    fahrElement.classList.add("hidden");
    celsiusElement.classList.remove("hidden");
  }

  let fahrenheitElememt = document.querySelector(".temp-units .fahrenheit");
  fahrenheitElememt.addEventListener("click", showFahrenheitValue);

  let celsiusElememt = document.querySelector(".temp-units .celsius");
  celsiusElememt.addEventListener("click", showCelsiusValue);
}

//GET CURRENT LOCATION
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}


function getCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  axios
          
    .all([
        axios.get(`${apiURL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKEY}`),
        axios.get(
          `${apiForecastURL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKEY}`
        ),
      ])
      .then(
        axios.spread((current, forecast) => {
          getCityDetails(current);
          getForecastDetails(forecast);
        })
      );

}
let currentButton = document.querySelector("#current-location-button");
currentButton.addEventListener("click", getCurrentLocation);
