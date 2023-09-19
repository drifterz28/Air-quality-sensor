const airIndexMap = [
  "Good",
  "Moderate",
  "Unhealthy for Sensitive Groups",
  "unhealthy",
  "Very unhealthy",
  "Hazardous",
];

const airIndexColors = [
  "#689F38",
  "#FBC02D",
  "#F57C00",
  "#C53929",
  "#AD1457",
  "#880E4F",
];

const airQualityIndex = (aqi) => {
  let aqiLevel = 0;
  if (aqi > 51 && aqi <= 100) {
    aqiLevel = 1;
  } else if (aqi > 101 && aqi <= 150) {
    aqiLevel = 2;
  } else if (aqi > 151 && aqi <= 200) {
    aqiLevel = 3;
  } else if (aqi > 201 && aqi <= 300) {
    aqiLevel = 4;
  } else if (aqi > 301) {
    aqiLevel = 5;
  }
  return aqiLevel;
};

function linear(AQIhigh, AQIlow, concHigh, concLow, concentration) {
  const conc = parseFloat(concentration);
  const a =
    ((conc - concLow) / (concHigh - concLow)) * (AQIhigh - AQIlow) + AQIlow;
  return Math.round(a);
}
// linear and AQIPM25 functions from https://www.airnow.gov/sites/default/files/custom-js/conc-aqi.js
// and the site https://www.airnow.gov/aqi/aqi-calculator-concentration/
function AQIPM25(concentration) {
  const conc = parseFloat(concentration);
  const c = Math.floor(10 * conc) / 10;
  let AQI;

  if (c >= 0 && c < 12.1) {
    AQI = linear(50, 0, 12, 0, c);
  } else if (c >= 12.1 && c < 35.5) {
    AQI = linear(100, 51, 35.4, 12.1, c);
  } else if (c >= 35.5 && c < 55.5) {
    AQI = linear(150, 101, 55.4, 35.5, c);
  } else if (c >= 55.5 && c < 150.5) {
    AQI = linear(200, 151, 150.4, 55.5, c);
  } else if (c >= 150.5 && c < 250.5) {
    AQI = linear(300, 201, 250.4, 150.5, c);
  } else if (c >= 250.5 && c < 350.5) {
    AQI = linear(400, 301, 350.4, 250.5, c);
  } else if (c >= 350.5 && c < 500.5) {
    AQI = linear(500, 401, 500.4, 350.5, c);
  }
  return AQI;
}
function AQIPM10(concentration) {
  const conc = parseFloat(concentration);
  const c = Math.floor(conc);
  let AQI;
  if (c >= 0 && c < 55) {
    AQI = linear(50, 0, 54, 0, c);
  } else if (c >= 55 && c < 155) {
    AQI = linear(100, 51, 154, 55, c);
  } else if (c >= 155 && c < 255) {
    AQI = linear(150, 101, 254, 155, c);
  } else if (c >= 255 && c < 355) {
    AQI = linear(200, 151, 354, 255, c);
  } else if (c >= 355 && c < 425) {
    AQI = linear(300, 201, 424, 355, c);
  } else if (c >= 425 && c < 505) {
    AQI = linear(400, 301, 504, 425, c);
  } else if (c >= 505 && c < 605) {
    AQI = linear(500, 401, 604, 505, c);
  }
  return AQI;
}
const weatherHTML = (weather) => {
  const temp = (weather.tp * 9) / 5 + 32;
  return `Temp: ${temp}, Humitiy: ${weather.hu}`;
};

const main = async () => {
  const weatherResponse = await fetch(
    "https://api.airvisual.com/v2/nearest_city?lat=44.0795136&lon=-121.274368&key=700030cf-0d66-4fe1-a3cb-e2c6582a7a8c"
  );
  const weather = await weatherResponse.json();
  const response = await fetch("/data.json");
  const data = await response.json();
  const weatherNode = document.getElementById("weatherData");
  const pm25 = document.getElementById("pm25");
  const pm10 = document.getElementById("pm10");
  const aqi = document.getElementById("aqi");
  const footer = document.getElementById("footer-data");
  const colorLevel = document.getElementById("colorLevel");
  const healthLevel = document.getElementById("health-level");
  const aqiLevel = AQIPM25(data["pm25 env"]);
  const pm10Level = airQualityIndex(AQIPM10(data["pm100 env"]));
  const level = airQualityIndex(aqiLevel);
  const realAqi = weather.data.current.pollution.aqius;
  const weatherItems = weather.data.current.weather;
  const pm25Wrapper = pm25.parentElement.parentElement;
  const pm10Wrapper = pm10.parentElement.parentElement;

  colorLevel.style.backgroundColor = airIndexColors[level];
  pm25Wrapper.style.backgroundColor = airIndexColors[level];
  pm25Wrapper.style.color = level <= 2 ? "#000" : "#fff";
  healthLevel.textContent = airIndexMap[level];
  aqi.textContent = aqiLevel;
  pm10Wrapper.style.backgroundColor = airIndexColors[pm10Level];
  pm10Wrapper.style.color = pm10Level <= 2 ? "#000" : "#fff";
  pm25.textContent = data["pm25 env"];
  pm10.textContent = data["pm100 env"];
  footer.textContent = `CPU1 Temp: ${data["cpuTemp0"]}, CPU2 temp: ${data["cpuTemp1"]}, other AQI ${realAqi}`;
  weatherNode.textContent = weatherHTML(weatherItems);
};

window.addEventListener("DOMContentLoaded", main);
