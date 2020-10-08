let apiURL = "https://api.openweathermap.org/data/2.5/forecast";
let apiKEY = "2c7be81cdfd4348e785209fd2490e8d1";

function searchCity(event) {
  event.preventDefault();
  let cityEntry = document.querySelector("#city-input").value;
  if (cityEntry) {
    axios
      .get(`${apiURL}?q=${cityEntry}&units=metric&appid=${apiKEY}`)
      .then(getCityDetails);
  } else {
    alert("Please enter a city");
  }
}

function getCityDetails(response) {
  console.log(response);
  let cityName = document.querySelector("#city");
  cityName.innerHTML = response.data.city.name;

  let cityDesc = document.querySelector("#description");
  cityDesc.innerHTML = response.data.list[0].weather[0].description;

  let cityTempIcon = document.querySelector("#temp-icon");
  cityTempIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${response.data.list[0].weather[0].icon}@2x.png" />`;

  let cityTemp = document.querySelector("#temperature");
  cityTemp.innerHTML = `${Math.round(response.data.list[0].main.temp)}°C`;

  let cityHumidity = document.querySelector("#humidity");
  cityHumidity.innerHTML = `Humidity: ${Math.round(
    response.data.list[0].main.humidity
  )}%`;

  let citywindSpeed = document.querySelector("#wind");
  citywindSpeed.innerHTML = `Wind: ${Math.round(
    response.data.list[0].wind.speed
  )}km/h`;

  //GET DATE
  let cDate = new Date();
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
  let weekDay = document.querySelector("#date");
  let hours = cDate.getHours();
  let mins = cDate.getMinutes();
  let cTime = `${hours}:${mins} `;

  if (mins < 10) {
    cTime = `${hours}:0${mins} `;
  }

  weekDay.innerHTML = `${wDay} ${cTime}`;
}

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

//GET CURRENT LOCATION
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}
function getCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  axios
    .get(`${apiURL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKEY}`)
    .then(getCityDetails);
}
let currentButton = document.querySelector("#current-location-button");
currentButton.addEventListener("click", getCurrentLocation);
