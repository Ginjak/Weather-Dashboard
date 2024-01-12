// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");
var latitude = "";
var longitude = "";

// var queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;

searchBtn.on("click", (event) => {
  event.preventDefault();
  var queryUrlCityCordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput.val()}&limit=5&appid=3c4f418d697258b26a8f47e2024d5b99`;

  fetch(queryUrlCityCordinates)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      console.log(data);
      latitude = data[0].lat.toFixed(4);
      longitude = data[0].lon.toFixed(4);
      console.log(latitude);
      console.log(longitude);

      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&&lon=${longitude}&appid=3c4f418d697258b26a8f47e2024d5b99`;

      fetch(queryURL)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          console.log(data);

          // Display city name - console.log(data.city.name);
          // Temp console.log((data.list[0].main.temp - 273.15).toFixed(2));
          // Wind console.log(data.list[0].wind.speed);
          // Humidity console.log(data.list[0].main.humidity);
          // Icon code console.log(data.list[0].weather[0].icon);
          // Icon url: http://openweathermap.org/img/w/10d.png
          // var forcastTodayCity = $(
          //   `<img src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png">`
          // );
          var forcastHeading = $(
            `<h2>${searchInput.val()} ${dayjs().format(
              "(DD/MM/YYYY)"
            )} <img src="http://openweathermap.org/img/w/${
              data.list[0].weather[0].icon
            }.png"></h2>`
          );
          var forcastTemp = $(
            `<p>Temp: ${(data.list[0].main.temp - 273.15).toFixed(
              2
            )} &deg;C</p>`
          );

          forcastToday.append(forcastHeading, forcastTemp);
        });
    });
});
