var ApiKey = "f8d63ae63c009db1cf285baede197f1d"
displayHistory()
function getCityLocation(){
    var textBox = document.getElementById("city")
    var cityName = textBox.value
    var history = JSON.parse(localStorage.getItem("history"))
    history.push(cityName)
    localStorage.setItem("history", JSON.stringify(history))
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
        tempEl.textContent = weatherJson["current"]["temp"]
        windEl.textContent = weatherJson["current"]["wind_speed"]
        humidityEl.textContent = weatherJson["current"]["humidity"]+"%"
        uvEl.textContent = weatherJson["current"]["uvi"]
        var currentDate = new Date()
        console.log(currentDate);
        currentDateEl.textContent = (currentDate.getMonth()+ 1)+ "/"+ currentDate.getDate()+ "/"+ currentDate.getFullYear();
        var futureForecastEl = document.getElementById("futureForecast")
        futureForecastEl.innerHTML = ""
        for(var i =0; i<5; i++){
            var dayForecastEl = document.createElement("div")
            dayForecastEl.classList.add("col-sm-2")
            var dateEl = document.createElement("div")
            var imageEl = document.createElement("img")
            var dayTempEl = document.createElement("div")
            var dayWindEl = document.createElement("div")
            var dayHumidityEl = document.createElement("div")
            dayTempEl.textContent = weatherJson["daily"][i]["temp"]["day"]
            dayWindEl.textContent = weatherJson["daily"][i]["wind_speed"]
            dayHumidityEl.textContent = weatherJson["daily"][i]["humidity"]
            var date = new Date()
            date.setDate(currentDate.getDate()+1+i)
            dateEl.textContent = (date.getMonth()+ 1)+ "/"+ date.getDate()+ "/"+ date.getFullYear();
            var icon = weatherJson["daily"][i]["weather"][0]["icon"]
            imageEl.src="https://openweathermap.org/img/w/"+icon+".png"
            dayForecastEl.appendChild(dateEl)
            dayForecastEl.appendChild(imageEl)
            dayForecastEl.appendChild(dayTempEl)
            dayForecastEl.appendChild(dayWindEl)
            dayForecastEl.appendChild(dayHumidityEl)
            futureForecastEl.appendChild(dayForecastEl)
        }
    })
}
function displayHistory(){
    var historyButtons = document.getElementById("history-buttons")
    if(localStorage.getItem("history")){
        var history = JSON.parse(localStorage.history)
        for(var i =0; i<history.length; i++){
            var button = document.createElement("button")
            button.innerHTML = history[i]
            button.setAttribute("cityName", history[i])
            button.addEventListener("click", function(event){
                var textBox = document.getElementById("city")
                textBox.value = event.target.getAttribute("cityName")
                getCityLocation()
            })
            historyButtons.appendChild(button)
        }
    }
    else{
        localStorage.setItem("history", JSON.stringify([]))
    }
}