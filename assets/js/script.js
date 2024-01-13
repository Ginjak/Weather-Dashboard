// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");
var forecastFiveDays = $("#forecast");
var historySection = $("#history");
var searchHistoryArr = [];
var latitude = "";
var longitude = "";
// for (var v = 0; v < 1; v++) {
//   var test = ["a", "A", "b", "b", "cc", "c", "c"];
//   var test3 = [...new Set(test)].map(
//     (item) => item.charAt(0).toUpperCase() + item.slice(1)
//   );

//   console.log(test3);
// }

searchBtn.on("click", (event) => {
  event.preventDefault();
  forcastToday.empty();
  forecastFiveDays.empty();
  searchHistoryArr.push(searchInput.val());

  var historyArrToLs = JSON.stringify(searchHistoryArr);
  localStorage.setItem("city", historyArrToLs);

  var historyObjFromLs = localStorage.getItem("city");
  var historyArrFromLs = JSON.parse(historyObjFromLs);
  var historyArrNoDuplicates = [...new Set(historyArrFromLs)].map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1)
  );

  for (var j = 0; j < 10; j++) {
    var historyItem = $(
      `<li class="list-group-item">${historyArrNoDuplicates[j]}</li>`
    );
    historySection.append(historyItem);
  }

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

          var forcastHeading = $(
            `<h2>${
              searchInput.val().charAt(0).toUpperCase() +
              searchInput.val().slice(1)
            } ${dayjs().format(
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
          var forcastWind = $(`<p>Wind: ${data.list[0].wind.speed} KPH</p>`);
          var forcastHumidity = $(
            `<p>Humidity: ${data.list[0].main.humidity}%</p>`
          );

          forcastToday.append(
            forcastHeading,
            forcastTemp,
            forcastWind,
            forcastHumidity
          );

          var fiveDaysHeader = $(`<h4>5-Day Forecast</h4>`);
          forecastFiveDays.append(fiveDaysHeader);
          for (var i = 1; i < 6; i++) {
            var fiveDaysCard = $(`<div class="card col-2">
          <div class="card-body">
            <h6 class="card-title">${dayjs()
              .add(i - 1 + 1, "day")
              .format("DD/MM/YYYY")}</h6>
              <img src="http://openweathermap.org/img/w/${
                data.list[i * 8 - 1].weather[0].icon
              }.png">
            <p class="card-text">Temp: ${(
              data.list[i * 8 - 1].main.temp - 273.15
            ).toFixed(2)} &deg;C</p>
            <p class="card-text">Wind: ${
              data.list[i * 8 - 1].wind.speed
            } KPH</p>
            <p class="card-text">Humidity: ${
              data.list[i * 8 - 1].main.humidity
            }%</p>
          </div>
        </div>`);

            forecastFiveDays.append(fiveDaysCard);
          }
        });
    });
});
