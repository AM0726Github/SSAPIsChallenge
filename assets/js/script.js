function initPage() {
  const cityEl = document.getElementById("enter-city");
  const searchEl = document.getElementById("search-button");
  const nameEl = document.getElementById("city-name");
  const currentPicEl = document.getElementById("current-pic");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  var fivedayEl = document.getElementById("fiveday-header");
  var todayweatherEl = document.getElementById("today-weather");

  // Assigning an API to a constant
  const APIKey = "84b79da5e5d7c92085660485702f4ce8";

  function getWeather(cityName) {
    // get request from OpenWeather server
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    fetch(queryUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      todayweatherEl.classList.remove("d-none");
      // Current data displying
      const currentDate = new Date(response.data.dt * 1000);
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
      let weatherPic = response.data.weather[0].icon;
      currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
      currentPicEl.setAttribute("alt", response.data.weather[0].description);
      currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
      currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
      currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

    });
  };
};

initPage();