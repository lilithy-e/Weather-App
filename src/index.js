// UPDATING THE DAY/TIME IN THE TOP RIGHT CORNER
function formatDate(date) {
  let hour = date.getHours();
  let minutes = date.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let today = days[date.getDay()];
  // fixing the formatting, because if mins is <10 then it just returns 12:1 for example
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  return `${today}, ${hour}:${minutes}`;
}

function convertToFahr(event){
  event.preventDefault();
  let todayTemp = document.querySelector("#today-temp");
  let toFahr = (celsiusTemp * 9/5) + 32;
  unitInCelsius.classList.remove("active");
  unitInFahr.classList.add("active");
  todayTemp.innerHTML = Math.round(toFahr);
}

function convertToCelsius(event){
  event.preventDefault();
  let todayTemp = document.querySelector("#today-temp");
  unitInCelsius.classList.add("active");
  unitInFahr.classList.remove("active");
  todayTemp.innerHTML= Math.round(celsiusTemp);
}

// wHEN SEARCHING FOR CITY, IT DISPLAYS THE CITY NAME

function handleSubmit(event) {
  event.preventDefault();  
  let city = document.querySelector("#search-city-input").value;

  search(city);
}

function search(city) {
  let apiKey = "96ea5c1786f685219a008c5ac3a5e1e7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
//this function will get the user's location
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "96ea5c1786f685219a008c5ac3a5e1e7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function formatForecastDay(timeStamp){
  let date = new Date(timeStamp*1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue","Wed","Thu","Fri","Sat"];
  
  return days[day];
}

function getForecast(coordinates){
  let apiKey = "96ea5c1786f685219a008c5ac3a5e1e7";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  
  axios(apiURL).then(displayForecast);
}

function displayForecast(response){
  
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
    
  forecast.forEach(function(forecastDay, index) {
    if (index<6){
    forecastHTML +=`  
    <div class="col-2">
        <div class="forecast-day">${formatForecastDay(forecastDay.dt)}</div>
        <div class="forecast-icon">
        <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="" width="50"></img>
        </div> 
        <div class="forecast-temp">${Math.round(forecastDay.temp.max)} °C</div>
    </div>
    `}
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
  
//this is called by the function showPosition and updates weather info based on user's location
function showTemperature(response) {
  getForecast(response.data.coord);
 // displayForecast(response);
  
  document.querySelector("#current-location").innerHTML = response.data.name;

  celsiusTemp = response.data.main.temp;
  fahrenheitTemp = (celsiusTemp-32)*(5/9);

  document.querySelector("#today-temp").innerHTML = Math.round(
    celsiusTemp
  );
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(".description").innerHTML =
    response.data.weather[0].description;

  let icon = response.data.weather[0].icon;
  let iconSrc = document.querySelector("#icon");
  iconSrc.setAttribute("src",`http://openweathermap.org/img/wn/${icon}@2x.png`);
}

function getUserLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let celsiusTemp = null;
let fahrenheitTemp = null;

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmit);

let date = new Date(); // the new date variable to pass into the function
let dayTime = document.querySelector("#day-and-time");
dayTime.innerHTML = formatDate(date);

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", getUserLocation);
//navigator.geolocation.getCurrentPosition(showPosition);

//Unit conversion from C to F and vice versa
let unitInFahr = document.querySelector(".fahrenheit");
unitInFahr.addEventListener("click", convertToFahr);

let unitInCelsius = document.querySelector(".celsius");
unitInCelsius.addEventListener("click", convertToCelsius);

//Default City upon load
search("Ottawa");