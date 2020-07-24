let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}
let dateTime = document.querySelector("#date-time");
dateTime.innerHTML = `${day} ${hour}:${minute}`;

function showWeatherInfo(response) {
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(
    "#city-name"
  ).innerHTML = response.data.name.toUpperCase();
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function searchCity(city) {
  let apiKey = "caa34f2f02bff4b74600363cf67bbbef";
  let units = "metric";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherInfo);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input-value");
  let city = searchInput.value;
  searchCity(city);
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "c99513df28b9f641d3dba84f83c45b6d";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let apiUrl = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherInfo);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let form = document.querySelector("#form-search");
form.addEventListener("submit", handleSubmit);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentLocation);

searchCity("berlin");
