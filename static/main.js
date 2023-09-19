const airIndexMap = [
  "Good",
  "Moderate",
  "Unhealthy",
  "Very Poor",
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

const tempValues = {
  "pm10 env": 34,
  "pm100 env": 64,
  "particles 03um": 8136,
  "particles 10um": 498,
  "pm25 env": 52,
  "particles 05um": 2394,
  "particles 25um": 28,
  "particles 100um": 0,
  "particles 50um": 4,
};

function linear(AQIhigh, AQIlow, concHigh, concLow, concentration) {
  const conc = parseFloat(concentration);
  const a =
    ((conc - conclow) / (concHigh - concLow)) * (AQIhigh - AQIlow) + AQIlow;
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

const main = () => {};

window.addEventListener("DOMContentLoaded", main);
