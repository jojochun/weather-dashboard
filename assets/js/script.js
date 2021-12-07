
var searchBtnEl = $("#search-btn");
var clearBtnEl = $("#clear-btn");
var currentCityEl = $("#current-city");
var currentTempEl = $("#temperature");
var currentHumidityEl = $("#humidity");
var currentWindEl = $("#wind-speed");
var currentUVEl = $("#uv-index");
var pastHistoryEl = $("#past-search")



// var APIkey = be713046da2f1520bb5a2702cd2e8948
var APIKey = "be713046da2f1520bb5a2702cd2e8948";


// get input for city
function searchCity() {
    var searchCityEl = $("#search-city");

    // get value form input element
    var city = searchCityEl.val();
    if (city) {
        // add to searchHistory array
        searchHistory.push(city.toUpperCase());
        currentWeather(city);           // send element to currentWeather
        forecastFive(city);             // send element to forecastFive

        searchCityEl.val("");           // clear input field

    } else {
        alert("Please enter a city");
    }
    saveSearch();

}

// function to save city searched
function saveSearch() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}


// get value from stored data from previous searches
//array to store searched cities
var searchHistory = [];
function getStored(event) {
    event.preventDefault();
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
        for (var i = 0; i < searchHistory.length; i++) {
            // create li item that will contain a button
            var pastHistoryBtnEl = document.createElement("li");
            // append a button to pastHistoryBtnlEl
            pastHistoryBtnEl.innerHTML = "<button type='button' class='d-flex w-100 btn-light border p-2' attr='" + searchHistory[i] + "'>" + searchHistory[i] + "</button>";
            // append li item to div
            pastHistoryEl.appendChild(pastHistoryBtnEl);

        }
    }
    // display the past search if the list group item is clicked
    var pastHistoryBtnEl = event.target;
    if (event.target.matches(pastHistoryEl)) {
        city = pastHistoryEl.textContent.trim();
        searchCity(city);
    }


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
                    var iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                    // display  city name/date/icon
                    $(currentCityEl).html(city + date + "<img src=" + iconUrl + ">");

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
                                        // if: between values, add class (ie. low or high), 3 if statements
                                        if (data.value < 2) {
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
function forecastFive(city) {
    var dayFive = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    fetch(dayFive).then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (data) {
                    console.log(data)
                    // for loop for day1 to day5 of fiveDay forecast
                    for (var i = 0; i < 5; i++) {
                        // date
                        var fiveDayContainer = $("#five-day-container");
                        var forecastDay = data.list[i]
                        var date = moment(forecastDay.dt).format("MMM D, YYYY")


                        dateEl = document.createElement("h4");
                        $(dateEl).attr("card-header text-center");
                        $(dateEl).html(date);
                        fiveDayContainer.append(dateEl);


                        // icon
                        var iconUrl = "https://openweathermap.org/img/w/" + forecastDay.weather[0].icon + ".png";
                        iconEl = document.createElement("img");
                        $(iconEl).attr("card-body text-center");
                        $(iconEl).html("<img src=" + iconUrl + ">");
                        fiveDayContainer.append(iconEl);



                        // temp
                        var temp = (forecastDay.main.temp - 273.15) * 1.80 + 32;
                        tempEl = document.createElement("h5");
                        $(tempEl).attr("card-body text-center");
                        $(tempEl).html("Temperature: " + temp + "&#8457");
                        fiveDayContainer.append(tempEl);


                        //humidity
                        var humidity = forecastDay.main.humidity;
                        humidityEl = document.createElement("h5");
                        $(humidityEl).attr("card-body text-center");
                        $(humidityEl).html("Humidity: " + humidity);
                        fiveDayContainer.append(humidityEl);





                    }





                })
        }
    })
}




// save searchedCity to list
searchBtnEl.click(searchCity)

