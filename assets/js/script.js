// Elements
var searchInput = $("#search-input");
var searchBtn = $("#search-button");

// var queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`;
var queryURL =
  "https://api.openweathermap.org/data/2.5/forecast?lat=33.44&&lon=-94.04&appid=3c4f418d697258b26a8f47e2024d5b99";
var queryUrlCityCordinates =
  "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=3c4f418d697258b26a8f47e2024d5b99";

https: fetch(queryURL)
  .then((resp) => {
    return resp.json();
  })
  .then((data) => {
    console.log(data);
  });

searchBtn.on("click", function () {
  var
});
