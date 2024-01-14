// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");
var forecastFiveDays = $("#forecast");
var historySection = $("#history");
var latitude = "";
var longitude = "";

function addItem() {
  // Retrieve existing array from local storage
  var searchHistory = JSON.parse(localStorage.getItem("Search History")) || [];

  // Add the new input value to the array
  if (searchInput.val() !== "") {
    // Convert input to lowercase, capitalize the first letter
    var newInput = searchInput.val().toLowerCase();
    newInput = newInput.charAt(0).toUpperCase() + newInput.slice(1);

    // Check for duplicates
    var index = searchHistory.indexOf(newInput);
    if (index !== -1) {
      // Remove the first occurrence of the duplicate entry
      searchHistory.splice(index, 1);
    }

    // Add the new entry
    searchHistory.push(newInput);
  }

  // Update local storage with the modified array
  localStorage.setItem("Search History", JSON.stringify(searchHistory));

  var historyArrNoDuplicates = searchHistory.slice(-4); // Limit to a maximum of 4

  historySection.empty();

  for (var i = 0; i < historyArrNoDuplicates.length; i++) {
    var searchHistoryItem = $(
      `<li class="list-group-item">${historyArrNoDuplicates[i]}</li>`
    );
    historySection.prepend(searchHistoryItem);
  }

  console.log(historyArrNoDuplicates);
}
addItem();

searchBtn.on("click", (event) => {
  event.preventDefault();
  forcastToday.empty();
  forecastFiveDays.empty();
  addItem();
  fetchFunction(searchInput.val());
  searchInput.val("");
});

$("#history").on("click", ".list-group-item", function () {
  fetchFunction($(this).text());
});

var fetchFunction = function (city) {
  var queryUrlCityCordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=3c4f418d697258b26a8f47e2024d5b99`;
  console.log(city);
  fetch(queryUrlCityCordinates)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      latitude = data[0].lat.toFixed(4);
      longitude = data[0].lon.toFixed(4);

      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&&lon=${longitude}&appid=3c4f418d697258b26a8f47e2024d5b99`;

      fetch(queryURL)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          forcastToday.empty();
          forecastFiveDays.empty();
          var forcastHeading = $(
            `<h2>${
              city.charAt(0).toUpperCase() + city.slice(1)
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
};
