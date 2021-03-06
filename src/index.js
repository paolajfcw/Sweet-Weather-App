function formatDate(timestamp) {
  let now = new Date(timestamp);

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

  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  return `${hour}:${minute}`;
}

function showWeatherInfo(response) {
  celsiusTemp = Math.round(response.data.main.temp);
  document.querySelector("#temperature").innerHTML = celsiusTemp;
  document.querySelector(
    "#city-name"
  ).innerHTML = response.data.name.toUpperCase();
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#date-time").innerHTML = formatDate(
    response.data.dt * 1000
  );
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function showForecast(response) {
  let forecastElements = document.querySelector("#forecast");
  forecastElements.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    maxTemp[index] = forecast.main.temp_max;
    minTemp[index] = forecast.main.temp_min;

    forecastElements.innerHTML += `
    <div class="col-2 forecast-hours">
    <h4>
      ${formatHours(forecast.dt * 1000)} 
    </h4>
    <img src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png" class="weather-image">
    <div><strong id="max-temp">${Math.round(
      forecast.main.temp_max
    )}°</strong> <span id="min-temp">${Math.round(
      forecast.main.temp_min
    )}°</span></div>
    </div>`;
  }
}

function searchCity(city) {
  let apiKey = "caa34f2f02bff4b74600363cf67bbbef";
  let units = "metric";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherInfo);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input-value");
  let city = searchInput.value;
  searchCity(city);
  searchInput.value = "";
}

function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "c99513df28b9f641d3dba84f83c45b6d";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let apiUrl = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeatherInfo);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showForecast);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  let fahrenheitMaxTemp = document.querySelectorAll("#max-temp");
  fahrenheitMaxTemp.forEach(function (item, index) {
    item.innerHTML = `${Math.round((maxTemp[index] * 9) / 5 + 32)}°`;
  });

  let fahrenheitMinTemp = document.querySelectorAll("#min-temp");
  fahrenheitMinTemp.forEach(function (item, index) {
    item.innerHTML = `${Math.round((minTemp[index] * 9) / 5 + 32)}°`;
  });
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemp;

  let celsiusMaxTemp = document.querySelectorAll("#max-temp");
  celsiusMaxTemp.forEach(function (item, index) {
    item.innerHTML = `${Math.round(maxTemp[index])}°`;
  });

  let celsiusMinTemp = document.querySelectorAll("#min-temp");
  celsiusMinTemp.forEach(function (item, index) {
    item.innerHTML = `${Math.round(minTemp[index])}°`;
  });
}

let celsiusTemp = null;
let maxTemp = [];
let minTemp = [];

let form = document.querySelector("#form-search");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-temp");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-temp");
celsiusLink.addEventListener("click", showCelsiusTemp);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("click", getCurrentLocation);

searchCity("berlin");
