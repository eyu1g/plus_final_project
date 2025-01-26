function searchWeather(event) {
    event.preventDefault();
  
    // Get the user input from the search box
    let searchInput = document.querySelector(".search-input");
    let cityName = searchInput.value.trim();
  
    // Validate input
    if (!cityName) {
      alert("Please enter a city name.");
      return;
    }
  
    // Update the city name in the UI
    let heading = document.querySelector(".current-city");
    heading.innerHTML = cityName;
  
    // Get the current date and time
    let now = new Date();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[now.getDay()];
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
  
    // Display current date and time
    let currentDetails = document.querySelector(".current-details");
    currentDetails.innerHTML = `${day} ${hours}:${minutes}, Loading weather...`;
  
    // API keys and endpoints
    let apiKey = "8aat9eo10f0a6eb2b603d03d4d464ff5"; // Replace with your actual API key
    let currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;
    let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityName}&key=${apiKey}&units=metric`;
  
    // Fetch current weather and forecast
    axios
      .get(currentWeatherUrl)
      .then((response) => {
        updateCurrentWeatherUI(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
        currentDetails.innerHTML = `Error: Could not fetch weather for "${cityName}".`;
      });
  
    axios
      .get(forecastUrl)
      .then((response) => {
        updateForecastUI(response.data.daily);
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  }
  
  function updateCurrentWeatherUI(data) {
    if (!data || !data.current) {
      alert("Current weather data not available.");
      return;
    }
  
    // Extract data
    let { temperature, wind_speed, condition, icon_url } = data.current;
    let weatherDescription = condition.description;
  
    // Update temperature
    let temperatureElement = document.querySelector(".current-temperature-value");
    temperatureElement.innerHTML = Math.round(temperature);
  
    // Update wind speed, description, and humidity
    let currentDetails = document.querySelector(".current-details");
    currentDetails.innerHTML = `${new Date().toLocaleString()}, ${weatherDescription} <br />
      Humidity: <strong>${data.current.humidity}%</strong>, Wind: <strong>${wind_speed.toFixed(1)} km/h</strong>`;
  
    // Update weather icon
    let weatherIcon = document.querySelector(".current-temperature-icon");
    weatherIcon.innerHTML = `<img src="${icon_url}" alt="${weatherDescription}" class="weather-icon" />`;
  }
  
  function updateForecastUI(dailyData) {
    if (!dailyData || dailyData.length === 0) {
      alert("Forecast data not available.");
      return;
    }
  
    let forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ""; // Clear existing forecast
  
    dailyData.slice(0, 5).forEach((day) => {
      let dayName = new Date(day.time * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      });
      let iconUrl = day.condition.icon_url;
      let description = day.condition.description;
      let tempMax = Math.round(day.temperature.maximum);
      let tempMin = Math.round(day.temperature.minimum);
  
      let forecastHTML = `
        <div class="forecast-day">
          <p class="forecast-day-name">${dayName}</p>
          <img src="${iconUrl}" alt="${description}" class="forecast-icon" />
          <p class="forecast-temp">${tempMax}° / ${tempMin}°</p>
        </div>
      `;
  
      forecastContainer.innerHTML += forecastHTML;
    });
  }
  
  // Attach event listener to the form
  let form = document.querySelector(".forming");
  form.addEventListener("submit", searchWeather);
  