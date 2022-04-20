const searchBtn = document.querySelector("#search-btn");
const historyContainer = document.querySelector("#history-container");
var cityArray = [];
var dataList;

function init() {
  var retrievedCity = JSON.parse(localStorage.getItem("cities"));
  if (retrievedCity !== null) {
    cityArray = retrievedCity;
  }
  setHistory();
}

function setHistory() {
  historyContainer.innerHTML = "";
  for (const element of cityArray) {
    var liEl = document.createElement("li");
    liEl.textContent = element;
    historyContainer.appendChild(liEl);
  }
}

function saveCity(cityName) {
  cityArray.unshift(cityName);
  if(cityArray.length>15){
    cityArray.pop()
  }
  localStorage.setItem("cities", JSON.stringify(cityArray));
  setHistory();
}

function printWeatherData(data, name){
  console.log(data);
  var boxColor
  let cityName = name
  console.log(name);
  let date = new Date(data.current.dt * 1000).toDateString()
  let mainContainer = document.querySelector("#main-forecast")
  let dailyContainer = document.querySelector("#day-forecast")

  if(data.current.uvi<4){
    boxColor = 'bg-green-500' 
  }else if(data.current.uvi>7.5){
    boxColor = 'bg-red-700'
  }else{
    boxColor = 'bg-orange-600'
  }

  mainContainer.innerHTML = '<h2 class="row text-3xl text-dark font-bold">'+cityName+ '<span class="text-2xl font-light">' + ' ' +date+'</span></h2><p class="row">Temp: '+data.current.temp+'°C</p><p class="row">Wind: '+data.current.wind_speed+' KPH</p><p class="row">Humidity: '+data.current.humidity+' %</p><p id="uvi" class="row">UV Index: <span class="px-2 py-1 '+boxColor+' rounded-sm">'+data.current.uvi+'</span></p>'

  dailyContainer.innerHTML = '<div class="flex flex-col basis-1/5 mx-3"><h3 class="row text-2xl text-dark font-bold"></h3><p class="row">28.0C</p><p class="row"></p><p class="row"></p><p class="row"></p></div>'

}

function getWeatherdata(data){
    let weatherData = data[0]
    if(weatherData === undefined){
      window.alert('Please input a valid location')
      return
    }else{
      console.log(weatherData);
    let cityName = weatherData.name
    saveCity(cityName);
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+weatherData.lat+"&lon="+weatherData.lon+"&units=metric&appid=e709763ea8ddaa60120d7a9bfd26c27e"
    fetch(url).then((response) => {return response.json()}).then((resp)=> printWeatherData(resp, cityName))
    }
    
}

function apiRequest(cityName) {

  var fetchLatLon =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=e709763ea8ddaa60120d7a9bfd26c27e";
  fetch(fetchLatLon).then((response) => {return response.json()}).then((data) => getWeatherdata(data))
}

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const cityName = document.querySelector("#city-name").value;
  apiRequest(cityName);
});
document.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchBtn.click();
  }
});

init();
