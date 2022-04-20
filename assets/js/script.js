// variable declaration
const searchBtn = document.querySelector("#search-btn");
const historyContainer = document.querySelector("#history-container");
var cityArray = [];
var dataList;

// initialising function retrieving history from local storage
function init() {
  var retrievedCity = JSON.parse(localStorage.getItem("cities"));
  if (retrievedCity !== null) {
    cityArray = retrievedCity;
  }
  setHistory();
}

// function to display history and add to html
function setHistory() {
  historyContainer.innerHTML = "";
  for (const element of cityArray) {
    var liEl = document.createElement("li");
    liEl.textContent = element;
    historyContainer.appendChild(liEl);
  }
}

// function to save the new searched city to the city array and local storage
function saveCity(cityName) {
  cityArray.unshift(cityName);
  if (cityArray.length > 15) {
    cityArray.pop();
  }
  localStorage.setItem("cities", JSON.stringify(cityArray));
  setHistory();
}

// function to print the main weather and 5 day forecast cards
function printWeatherData(data, name) {
  // local variable declaration
  var boxColor;
  let cityName = name;
  let date = new Date(data.current.dt * 1000).toDateString();
  let mainContainer = document.querySelector("#main-forecast");
  let dailyContainer = document.querySelector("#day-forecast");

  // check UV index to then color the background in the type of condition
  if (data.current.uvi < 4) {
    boxColor = "bg-green-500";
  } else if (data.current.uvi > 7.5) {
    boxColor = "bg-red-700";
  } else {
    boxColor = "bg-orange-600";
  }

  // adding main weather card design classes
  mainContainer.classList.add(
    "border-4",
    "border-sky-500",
    "w-full",
    "px-5",
    "py-3",
    "mb-3",
    "bg-gradient-to-r",
    "from-sky-500",
    "to-indigo-600"
  );

  // adding content to main weather card from the API call
  mainContainer.innerHTML =
    '<h2 class="row text-3xl text-dark font-bold">' +
    cityName +
    ' - <span class="text-2xl font-semibold text-slate-200">' +
    " " +
    date +
    '</span></h2><p class="row">Temp: ' +
    data.current.temp +
    '°C</p><p class="row">Wind: ' +
    data.current.wind_speed +
    ' KPH</p><p class="row">Humidity: ' +
    data.current.humidity +
    ' %</p><p id="uvi" class="row">UV Index: <span class="px-2 py-1 ' +
    boxColor +
    ' rounded-sm">' +
    data.current.uvi +
    "</span></p>";

  // adding content to the 5 day forecast div element
  // looping through the daily forecast in the returned object from the API call
  dailyContainer.innerHTML = data.daily
    .map((day, index) => {
      if (index > 0 && index < 6) {
        // only printing the days that are required
        let dateDaily = new Date(day.dt * 1000).toDateString();
        let icon = day.weather[0].icon + "@2x.png";
        let iconAlt = day.weather[0].description;
        let temp = day.temp.day;
        let wind = day.wind_speed;
        let humid = day.humidity;
        // returning the HTML code to print
        return (
          '<div class="flex flex-col basis-1/5 mx-3 border-sky-500 border-4 rounded-lg px-2 py-2 mb-2"><h3 class="row text-2xl text-dark font-bold">' +
          dateDaily +
          '</h3><img src="https://openweathermap.org/img/wn/' +
          icon +
          '" alt="' +
          iconAlt +
          '"><p class="row text-md">Temp: ' +
          temp +
          '°C</p><p class="row">Wind: ' +
          wind +
          ' KPH</p><p class="row">Humidity: ' +
          humid +
          " %</p></div>"
        );
      }
    })
    .join(" ");
}

// function to get weather data for a given latitude and longitude
function getWeatherdata(data, type) {
  let weatherData = data[0];
  if (weatherData === undefined) {
    // checks if input city is a valid one
    window.alert("Please input a valid location");
  } else {
    let cityName = weatherData.name;
    if (type === "search") { //check if api call is from the search bar. if it is then only update the history
      saveCity(cityName);
    }
    var url =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      weatherData.lat +
      "&lon=" +
      weatherData.lon +
      "&units=metric&appid=e709763ea8ddaa60120d7a9bfd26c27e";
    fetch(url) // API call returns weather object
      .then((response) => {
        return response.json();
      })
      .then((resp) => printWeatherData(resp, cityName)); // send object to print weather data function
  }
}

// function to return search locations data such as latitude, longitude and name
function apiRequest(cityName, type) {
  var fetchLatLon =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=e709763ea8ddaa60120d7a9bfd26c27e";
  fetch(fetchLatLon)
    .then((response) => {
      return response.json();
    })
    .then((data) => getWeatherdata(data, type));
}

// event listener on the historyContainer
historyContainer.addEventListener("click", function (event) {
  event.preventDefault();
  const cityName = event.target.textContent; // get the name of the city clicked on in history
  var type = "history";
  // check what type of api call is it. from history or from search
  apiRequest(cityName, type);
});

// search button event listener
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  // get value of the input field
  const cityName = document.querySelector("#city-name").value;
  var type = "search";
  apiRequest(cityName, type);
});

// event listener to allow search from the Enter button
document.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchBtn.click();
  }
});

// initialise the app
init();
