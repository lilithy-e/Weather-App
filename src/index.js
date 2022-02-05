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
  todayTemp.innerHTML = Math.round(toFahr);
}

function convertToCelsius(event){
  event.preventDefault();
  let todayTemp = document.querySelector("#today-temp");
  unitInFahr.classList.add("active");
  unitInCelsius.classList.remove("active");
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

function getForecast(coordinates){
  let apiKey = "96ea5c1786f685219a008c5ac3a5e1e7";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  
  axios(apiURL).then(displayForecast);
}

function displayForecast(response){
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  
  let days = ["Mon","Tue","Wed","Thurs","Fri", "Sat"];
  
  days.forEach(function(day) {
    forecastHTML = forecastHTML +`  
    <div class="col-2">
        <div class="forecast-day">${day}</div>
        <div class="forecast-icon">
        <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="" width="50"></img>
        </div> 
        <div class="forecast-temp">21.4°C</div>
    </div>
    `
  });
  forecastHTML = forecastHTML + `</div>`;
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
  
  
  //let city = response.data.name;
  /* let temp = Math.round(response.data.main.temp);
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let description = response.data.weather[0].description;
  let feelsLike = Math.round(response.data.main.feels_like);
  let h2 = document.querySelector("#today-temp");
  h2.innerHTML = temp;
  let li_wind = document.querySelector("#wind");
  li_wind.innerHTML = wind;
  let li_humidity = document.querySelector("#humidity");
  li_humidity.innerHTML = humidity;
  //Changing the weather description
  let li_description = document.querySelector(".description");
  li_description.innerHTML = description;
  let li_feelsLike = document.querySelector("#feels-like");
  li_feelsLike.innerHTML = feelsLike; */
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