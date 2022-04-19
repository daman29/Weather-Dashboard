const searchBtn = document.querySelector('#search-btn')
const historyContainer = document.querySelector('#history-container')
var cityArray = []

function init(){
    var retrievedCity = JSON.parse(localStorage.getItem('cities'))
    if(retrievedCity !== null){
        cityArray = retrievedCity
    }
    setHistory()
}

function setHistory(){
    historyContainer.innerHTML=''
    for(const element of cityArray){
        var liEl = document.createElement('li')
        liEl.textContent = element
        historyContainer.appendChild(liEl)
    }
}

function saveCity(cityName){
    cityArray.unshift(cityName)
    localStorage.setItem('cities',JSON.stringify(cityArray))
    setHistory()
}

searchBtn.addEventListener('click',function(event){
    event.preventDefault()
    const cityName= document.querySelector('#city-name').value

    saveCity(cityName)
})
document.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchBtn.click();
    }
});

init()