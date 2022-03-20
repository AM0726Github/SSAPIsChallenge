// Variables for displaying all respond data from fetch requests
var CityButtonElement = document.getElementById("CityButton");
var CityNameElement = document.getElementById("CityName");
var ResultsElement = document.getElementById("Results");
var CityHistoryElement = document.getElementById("CityHistory");
var ResultCityElement = document.getElementById("ResultCity");
var CurrentDateElement = document.getElementById("CurrentDate");
var CurrentWeatherIcoElement = document.getElementById("CurrentWeatherIco");
var CityCurrentTempElement = document.getElementById("CityCurrentTemp");
var CityCurrentWindElement = document.getElementById("CityCurrentWind");
var CityCurrentHumidityElement = document.getElementById("CityCurrentHumidity");
var CityCurrentUvIElement = document.getElementById("CityCurrentUvI");
var CityFiveDaysForecastElement = document.getElementById("CityFiveDaysForecast");
// Api key for requesting weather data from openweathermap
const ApiKey = "6439e5d4a0c95a78102ba239e4f61ffa";
// An array variable for storing searched citys names 
var SearchHistory = [];
// variable to store current date/time
const DateTime = luxon.DateTime;

var GetWeather = function (CityName) {
  // Fetch request by City Name
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CityName}&appid=${ApiKey}`
  ).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        var ResultCity = data.name;
        if (!SearchHistory.includes(ResultCity)) {
          SearchHistory.push(ResultCity);
          localStorage.setItem("CityHistory", JSON.stringify(SearchHistory));
        }
        // Fetch request by using previus request deta Lat & Lon
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=imperial&exclude=hourly&appid=${ApiKey}`
        ).then((response) =>
          response.json().then((data) => {
            ResultCityElement.innerText = ResultCity;
            CurrentDateElement.innerText = DateTime.fromSeconds(data.current.dt).toLocaleString();
            CurrentWeatherIcoElement.innerHTML = `<img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png" />`;
            CityCurrentTempElement.innerHTML = `${data.current.temp}&deg;F`;
            CityCurrentWindElement.innerHTML = `${data.current.wind_speed} MPH`;
            CityCurrentHumidityElement.innerHTML = `${data.current.humidity}%`;
            var uvIndex = data.current.uvi;
            CityCurrentUvIElement.innerHTML = uvIndex;
            if (uvIndex < 5) {
              CityCurrentUvIElement.classList = "badge bg-success";
            } else if (uvIndex < 10) {
              CityCurrentUvIElement.classList = "badge bg-warning";
            } else {
              CityCurrentUvIElement.classList = "badge bg-danger";
            }
            CityFiveDaysForecastElement.innerHTML = "";
            var NextForecast = data.daily;
            for (var i = 1; i < 6; i++) {
              var ForecastData = NextForecast[i];
              var date = DateTime.fromSeconds(ForecastData.dt).toLocaleString();
              var Icon = `<img src="https://openweathermap.org/img/w/${ForecastData.weather[0].icon}.png"`;
              var temp = ForecastData.temp.day;
              var wind = ForecastData.wind_speed;
              var humidity = ForecastData.humidity;
              var NextForecastCardEl = document.createElement("div");
              NextForecastCardEl.classList = "card col-12 col-xl-2";
              var HtmlContent = `<div class="card-body">
                                <h6 class="card-title">${date}</h4>
                                <div class="card-text">
                                    <div>
                                        ${Icon}
                                    </div>
                                    <div class="badge bg-info text-dark">
                                        Temp: ${temp}&deg;F
                                    </div>
                                    <div class="badge bg-info text-dark">Wind: ${wind} MPH</div>
                                    <div class="badge bg-info text-dark">Humidity: ${humidity}%</div>
                                </div>
                            </div>`;
              NextForecastCardEl.innerHTML = HtmlContent;
              CityFiveDaysForecastElement.appendChild(NextForecastCardEl);
            }
          })
        );
      });
    } else {
      ResultsElement.innerHTML = "No Data to wiew";
    }
  });
};

var SearchButtonHandler = function (evt) {
  var SearchCityName = CityNameElement.value;
  CityNameElement.value = "";
  CityButtonElement.classList.add("disabled");
  location.replace(`?city=${SearchCityName}`);
};

var NavigationToSearch = function() {
  var QueryString = location.search;
  if (QueryString) {
    QueryString.split("?")[1].split("&").forEach((q) => {
        if (q.split("=")[0] === "city") {
          GetWeather(q.split("=")[1]);
        } else {
          ResultsElement.innerHTML = "Search City To get Weather info";
        }
      });
  } else {
    ResultsElement.innerHTML = "Search City To get Weather info.";
  }
};
// Event listener for disabling search button if no entry in search input
CityNameElement.addEventListener("input", () => {
  if (CityNameElement.value) {
    CityButtonElement.classList.remove("disabled");
  } else {
    CityButtonElement.classList.add("disabled");
  }
});
//  Event listener for search button when clicked
CityButtonElement.addEventListener("click", SearchButtonHandler);
// Get Search History from local Storage
var GetSearchHistory = () => {
    var History = JSON.parse(localStorage.getItem("CityHistory"));
    SearchHistory = History;
    History.forEach((h) => {
    var aEl = document.createElement("a");
    aEl.classList = "list-group-item btn btn-info";
    aEl.innerHTML = h;
    aEl.href = `?city=${h}`;
    CityHistoryElement.appendChild(aEl);
  });
};

NavigationToSearch();
GetSearchHistory();
