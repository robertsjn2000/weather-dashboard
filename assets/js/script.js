// Created an API key and assigned it to a variable through the third party API key.
var ApiKey = "f8d63ae63c009db1cf285baede197f1d"
displayHistory()
// This function calls on the third party API to get the city location which is required to pull the city weather. 
function getCityLocation(){
    var textBox = document.getElementById("city")
    var cityName = textBox.value
    var history = JSON.parse(localStorage.getItem("history"))
    if(history.indexOf(cityName)=== -1){
        history.push(cityName)
        localStorage.setItem("history", JSON.stringify(history))
        displayHistory()
    }
    // history.push(cityName)
    // localStorage.setItem("history", JSON.stringify(history))
    var Url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ApiKey
    fetch(Url).then(function(weather){
        return weather.json();
    }).then(function(weatherJson){
        var long = weatherJson["coord"]["lon"]
        var lat = weatherJson["coord"]["lat"]
        console.log(weatherJson);
        var cityNameEl = document.getElementById("cityName")
        cityNameEl.textContent = weatherJson["name"]
       getCityWeather(long, lat) 
    })
}
// This function calls on the third party API to get the city weather using the city location from the previous function as reference. 
function getCityWeather(long, lat){
    var Url = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat="+lat+"&lon="+long+"&appid="+ ApiKey
    fetch(Url).then(function(weather){
        return weather.json()
    }).then(function(weatherJson){
        console.log(weatherJson);
        var tempEl = document.getElementById("currentTemp")
        var windEl = document.getElementById("currentWind")
        var humidityEl = document.getElementById("currentHumidity")
        var uvEl = document.getElementById("currentUv")
        var currentDateEl = document.getElementById("currentDate")
        tempEl.textContent = "Temp: " + weatherJson["current"]["temp"]
        windEl.textContent = "Wind: " + weatherJson["current"]["wind_speed"]
        humidityEl.textContent = "Humidity: " + weatherJson["current"]["humidity"]+"%"
        var uvI = weatherJson["current"]["uvi"]
        var span = document.createElement("span")
        span.textContent = "UV Index: " + uvI
        if(uvI < 2){
            span.style = "background-color: green"
        }
        else{
            span.style = "background-color: red"
        }
        uvEl.appendChild(span)
        // created a current date variable that will display teh correct date of today and the next five days for the five day forcast. 
        var currentDate = new Date()
        console.log(currentDate);
        currentDateEl.textContent = (currentDate.getMonth()+ 1)+ "/"+ currentDate.getDate()+ "/"+ currentDate.getFullYear();
        var futureForecastEl = document.getElementById("futureForecast")
        futureForecastEl.innerHTML = ""
        for(var i =0; i<5; i++){
            // inside this for loop divs and image elements are created and appended to the appropriate parent div. 
            var dayForecastEl = document.createElement("div")
            dayForecastEl.classList.add("col-sm-2")
            var dateEl = document.createElement("div")
            var imageEl = document.createElement("img")
            var dayTempEl = document.createElement("div")
            var dayWindEl = document.createElement("div")
            var dayHumidityEl = document.createElement("div")
            dayTempEl.textContent = "Temp: " + weatherJson["daily"][i]["temp"]["day"]
            dayWindEl.textContent = "Wind: " + weatherJson["daily"][i]["wind_speed"]
            dayHumidityEl.textContent = "Humidity: " + weatherJson["daily"][i]["humidity"]
            var date = new Date()
            date.setDate(currentDate.getDate()+1+i)
            dateEl.textContent = (date.getMonth()+ 1)+ "/"+ date.getDate()+ "/"+ date.getFullYear();
            var icon = weatherJson["daily"][i]["weather"][0]["icon"]
            imageEl.src="https://openweathermap.org/img/w/"+icon+".png"
            dayForecastEl.classList = "bg-secondary text-white card"
            dayForecastEl.appendChild(dateEl)
            dayForecastEl.appendChild(imageEl)
            dayForecastEl.appendChild(dayTempEl)
            dayForecastEl.appendChild(dayWindEl)
            dayForecastEl.appendChild(dayHumidityEl)
            futureForecastEl.appendChild(dayForecastEl)
        }
    })
}
// Created a function to display the history of city searches.
function displayHistory(){
    var historyButtons = document.getElementById("history-buttons")
    historyButtons.innerHTML=""
    if(localStorage.getItem("history")){
        var ul = document.createElement("ul")
        var history = JSON.parse(localStorage.getItem("history"))
        for(var i =0; i<history.length; i++){
            var li = document.createElement("li")
            var button = document.createElement("button")
            button.innerHTML = history[i]
            button.setAttribute("cityName", history[i])
            button.addEventListener("click", function(event){
                var textBox = document.getElementById("city")
                textBox.value = event.target.getAttribute("cityName")
                getCityLocation()
            })
            li.appendChild(button)
            ul.appendChild(li)
        }
        historyButtons.appendChild(ul)
    }
    else{
        localStorage.setItem("history", JSON.stringify([]))
    }
}