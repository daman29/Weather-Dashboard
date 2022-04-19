const searchBtn = document.querySelector('#search-btn')

searchBtn.addEventListener('click',function(event){
    event.preventDefault()
    const cityName= document.querySelector('#city-name').value
    console.log(cityName)
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