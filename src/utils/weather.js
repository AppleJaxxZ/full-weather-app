const request = require("request");
const dotenv = require("dotenv");
dotenv.config();

const weather = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_APP_API_KEY}&query=" +
    ${lat} +
    "," +
    ${long} +
    "&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("unable to find location.", undefined);
    } else {
      const data = body.current;
      const img = body.current.weather_icons;
      const time = body.location.localtime;
      const code = body.current.weather_code;
      callback(
        undefined,
        `<b>${time} <br><br> <img class='weather-icon' src=${img}><br> <br> ${data.weather_descriptions[0]}.<br><br> ${data.temperature} degrees. <br><br> Real-Feel: ${data.feelslike} degrees.<br><br> Universal Weather Code: ${code} `
      );
    }
  });
};

module.exports = weather;
