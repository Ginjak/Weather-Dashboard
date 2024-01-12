// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");

// var queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
var queryURL =
  "https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&&lon=0.1276&appid=3c4f418d697258b26a8f47e2024d5b99";
var queryUrlCityCordinates =
  "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=3c4f418d697258b26a8f47e2024d5b99";

https: fetch(queryURL)
  .then((resp) => {
    return resp.json();
  })
  .then((data) => {
    console.log(data);
    searchBtn.on("click", (event) => {
      event.preventDefault();
      // Display city name - console.log(data.city.name);
      // Temp console.log((data.list[0].main.temp - 273.15).toFixed(2));
      // Wind console.log(data.list[0].wind.speed);
      // Humidity console.log(data.list[0].main.humidity);
      // Icon code console.log(data.list[0].weather[0].icon);
      // Icon url: http://openweathermap.org/img/w/10d.png
      var forcastTodayCity = $(
        `<img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png">`
      );
      forcastToday.append(forcastTodayCity);
    });
  });
