// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");
var forecastFiveDays = $("#forecast");
var historySection = $("#history");
var latitude = "";
var longitude = "";

/* -----------------------
          Functions
----------------------- */

// Function take value from search input and to store in local storage and create a list item. Check for duplicates and limit to maximum length of 10 items
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
  // Limit history (without duplicates) array to max 10 elements
  var historyArrNoDuplicates = searchHistory.slice(-10);
  historySection.empty();
  // Loop to create a list item depending on history array (without duplicates) length
  for (var i = 0; i < historyArrNoDuplicates.length; i++) {
    var searchHistoryItem = $(
      `<li class="list-group-item">${historyArrNoDuplicates[i]}</li>`
    );
    historySection.prepend(searchHistoryItem);
  }
  // Create a clear history button if it doesn't exists already
  if ($("#btn-clear").length === 0 && historyArrNoDuplicates.length > 0) {
    $("#aside-column").append(
      $(
        `<div class="d-grid"><button class="btn btn-secondary text-uppercase fw-medium mt-3" id="btn-clear">Clear history</button></div>`
      )
    );
  }
}
addItem();

// Function to retrieve longititude andlatitude from search input value (must be City), retrieve forecast data depeneding on a city
var fetchFunction = function (city) {
  // Initial query with search input value (City)
  var queryUrlCityCordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=3c4f418d697258b26a8f47e2024d5b99`;

  // Data fetch method
  fetch(queryUrlCityCordinates)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      // If city without results is entered error message will show up
      if (!data || data.length === 0 || !data[0].lat || !data[0].lon) {
        var errorMessage = $(`<p class="px-2 text-danger">City not found</p>`);
        $("#error-message").empty().append(errorMessage);
        // if no error following code will be executed
      } else {
        // Clear error message
        $("#error-message").empty();
        // Get latitude and longitute with 4 decimals at the end
        latitude = data[0].lat.toFixed(4);
        longitude = data[0].lon.toFixed(4);

        // Pass values to new query URL (to get forecast data)
        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&&lon=${longitude}&appid=3c4f418d697258b26a8f47e2024d5b99`;

        fetch(queryURL)
          .then((resp) => {
            return resp.json();
          })
          .then((data) => {
            // Remove/empty forecast data to make sure it won't add extra elements
            forcastToday.empty();
            forecastFiveDays.empty();
            // Create elemenets dynamically from API data
            // Heading with City, date (using dayjs), forecast weather icon
            var forcastHeading = $(
              `<h2 class="fs-4 px-4 pt-4">${
                city.charAt(0).toUpperCase() + city.slice(1)
              } ${dayjs().format(
                "(DD/MM/YYYY)"
              )} <img src="http://openweathermap.org/img/w/${
                data.list[0].weather[0].icon
              }.png"></h2>`
            );
            // Temperature
            var forcastTemp = $(
              `<p class="px-4">Temp: ${(
                data.list[0].main.temp - 273.15
              ).toFixed(2)} &deg;C</p>`
            );
            // Wind speed
            var forcastWind = $(
              `<p class="px-4">Wind: ${data.list[0].wind.speed} KPH</p>`
            );
            // Humidity
            var forcastHumidity = $(
              `<p class="px-4 pb-4 mb-0">Humidity: ${data.list[0].main.humidity}%</p>`
            );
            // Add/append created elements to today forecast div
            forcastToday.append(
              forcastHeading,
              forcastTemp,
              forcastWind,
              forcastHumidity
            );
            // Five day forecast data and elements
            // Heading for section
            var fiveDaysHeader = $(`<h4 class="px-4 mb-3">5-Day Forecast</h4>`);
            forecastFiveDays.append(fiveDaysHeader);
            // Adding 5 cards with forecast data
            for (var i = 1; i < 6; i++) {
              // Card
              var fiveDaysCard =
                $(`<div class="card col-md-5 col-xl-2 border-0">
          <div class="card-body px-2">
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
              // Add/append cars to forecast section
              forecastFiveDays.append(fiveDaysCard);
            }
          });
      }
    })
    .catch((error) => {
      // console.log(`Error: ${error.message}`);
    });
};

/* -----------------------
      Event listeners
----------------------- */

// Event on search button click (clear all forecast data, run fetchFunction with input value and list item with input value to history div, clear input value)
searchBtn.on("click", (event) => {
  event.preventDefault();
  forcastToday.empty();
  forecastFiveDays.empty();
  fetchFunction(searchInput.val());
  addItem();
  searchInput.val("");
});

// Event on cler history button click. Clears local storage, clears forecast data, removes button itself and runs addItem function (to update history div)
$("#aside-column").on("click", "#btn-clear", () => {
  localStorage.clear();
  forcastToday.empty();
  forecastFiveDays.empty();
  addItem();
  $("#btn-clear").remove();
});

// Event on history div list item click, to display forecast data
$("#history").on("click", ".list-group-item", function () {
  fetchFunction($(this).text());
});
