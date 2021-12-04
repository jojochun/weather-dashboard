
var searchBtnEl = $("#search-btn");
var clearBtnEl = $("#clear-btn");
var currentCityEl = $("#current-city");
var currentTempEl = $("#temperature");
var currentHumidityEl = $("#humidity");
var currentWindEl = $("#wind-speed");
var currentUVEl = $("#uv-index");



// var APIkey = be713046da2f1520bb5a2702cd2e8948
var APIKey = "be713046da2f1520bb5a2702cd2e8948";


// var to store searched city
function searchCity() {
    var searchCityEl = $("#search-city");

    // get value form input element
    var city = searchCityEl.val();
    if (city) {
        currentWeather(city);         // send element to currentWeather
        searchCityEl.val("");          // clear input field

    } else {
        alert("Please enter a city");
    }
}

// get value from stored data from previous searches


//array to store searched cities
var searchHistory = [];
function getStored(event) {
    event.preventDefault();
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {

    }
    // display the past search if the list group item is clicked


}


function currentWeather(city) {
    // query url to make the API call 
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    // make a get request to url
    fetch(queryURL)
        .then(function (response) {
            //request successful
            if (response.ok) {

                response.json().then(function (data) {
                    console.log(data)
                    // get date using moment js
                    var date = moment().format(" MM/DD/YYYY");
                    // icon code from response
                    var icon = data.weather[0].icon
                    // icon url
                    var iconUrl = "https://openweathermap.org/img/w/" + icon + " .png"
                    // display  city name/date/icon
                    $(currentCityEl).html(city + date + iconUrl);

                    // temp in degreeF
                    var temp = (data.main.temp - 273.15) * 1.80 + 32;
                    $(currentTempEl).html("Temperature: " + temp + "&#8457");
                    // humidity
                    var humidity = data.main.humidity;
                    $(currentHumidityEl).html("Humidity: " + humidity);
                    // wind speed
                    var windSpeed = data.wind.speed;
                    $(currentWindEl).html("Wind Speed: " + windSpeed);
                    // uv index, need var lat and var lon to make a url request
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    var dayFive = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
                    var uvUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
                    fetch(dayFive).then(function (response) {
                        if (response.ok) {
                            response.json()
                                .then(function (data) {
                                    console.log(data)
                                })
                        }
                    })
                    fetch(uvUrl)
                        .then(function (response) {
                            if (response.ok) {
                                response.json()
                                    .then(function (data) {

                                        console.log(data)
                                        currentUVEl.text(data.value)
                                        // if: between values, add class (ie. low or high), 4 if statements
                                        if (data.value <= 2) {
                                            $(currentUVEl).attr("class", "low-green");
                                        };
                                        if (data.value > 2 && data.value <= 5) {
                                            $(currentUVEl).attr("class", "moderate-yellow");
                                        };
                                        if (data.value > 5); {
                                            $(currentUVEl).attr("class", "severe-red");
                                        };
                                    })
                            }
                        })
                })
            }
        });
}


// function to get 5-day forecast for current city




// save searchedCity to list
searchBtnEl.click(searchCity)
