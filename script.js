let searchBtn = document.getElementById("searchBtn");

const BaseURL = " https://api.weatherapi.com/v1";
const apiKey = "de45affe151a41339ff154103251809";

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
};

let currentCityWeather = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by this browser.");
    return;
  }

  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

  try {
    const position = await getLocation();
    const { latitude, longitude } = position.coords;
    await displayWeather(`${latitude},${longitude}`);
  } catch (error) {
    alert("Sorry, no position available.");
  }
};

let searchWeather = () => {
  let city = document.getElementById("cityInput").value;
  displayWeather(city);
};

let getWeather = async (query) => {
  const url = `${BaseURL}/current.json?key=${apiKey}&q=${query}`;
  try {
    const response = await fetch(url, options);
    let result = await response.text();
    result = JSON.parse(result);

    let city = result.location.name;
    let icon = result.current.condition.icon;
    let description = result.current.condition.text;
    let temperature = result.current.temp_c;
    let humidity = result.current.humidity;
    let wind = result.current.wind_kph;

    return { city, icon, description, temperature, humidity, wind };
  } catch (error) {
    console.error(error);
  }
};

let displayWeather = async (location) => {
  try {
    let weatherData = await getWeather(location);
    let { city, icon, description, temperature, humidity, wind } = weatherData;

    let cityName = document.getElementById("cityName");
    let weatherIcon = document.getElementById("weatherIcon");
    let weatherDesc = document.getElementById("description");
    let temp = document.getElementById("temperature");
    let hum = document.getElementById("humidity");
    let windSpeed = document.getElementById("windSpeed");

    console.log({
      city: city,
      "icon src": icon,
      description: description,
      temperature: `${temperature} °C`,
      humidity: `${humidity}%`,
      "wind Speed": `${wind} kph`,
    });

    cityName.innerText = city;
    weatherIcon.innerHTML = `<img src="${icon}" alt="${description} icon">`;
    weatherDesc.innerText = description;
    temp.innerText = `${temperature} °C`;
    hum.innerText = `Humidity: ${humidity}%`;
    windSpeed.innerText = `Wind Speed: ${wind} kph`;
  } catch (error) {
    alert(
      "Could not retrieve weather data. Please check the city name and try again.",
    );
  }
};

let autoSuggest = async () => {
  let cityInput = document.getElementById("cityInput");
  let suggestionList = document.getElementById("suggestionList");
  let autoSuggestDiv = document.querySelector(".autoSuggest");

  if (!cityInput.value.trim()) {
    autoSuggestDiv.style.visibility = "hidden";
    suggestionList.innerHTML = "";
    return;
  }

  const url = `${BaseURL}/search.json?key=${apiKey}&q=${cityInput.value}`;
  try {
    const response = await fetch(url, options);
    let places = await response.text();
    places = JSON.parse(places);
    console.log(places);
    suggestionList.innerHTML = "";

    if (places.length !== 0) {
      autoSuggestDiv.style.visibility = "visible";
    } else {
      autoSuggestDiv.style.visibility = "hidden";
    }

    places.forEach((place) => {
      suggestionList.innerHTML += `<li class="suggestion">${place.name}, ${place.country}</li>`;
    });
    let suggestions = document.querySelectorAll(".suggestion");
    suggestions.forEach((suggestion) => {
      suggestion.addEventListener("click", () => {
        cityInput.value = suggestion.innerText;
        suggestionList.innerHTML = "";
        autoSuggestDiv.style.visibility = "hidden";
      });
    });
  } catch (error) {
    console.error(error);
  }
};

currentCityWeather();
searchBtn.addEventListener("click", searchWeather);
document.getElementById("cityInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});
document.getElementById("cityInput").addEventListener("input", autoSuggest);
