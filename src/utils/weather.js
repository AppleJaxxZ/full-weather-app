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
      callback(
        undefined,
        `${data.weather_descriptions[0]}. It is currently ${data.temperature} degrees out.  It feels like ${data.feelslike} degrees out. `
      );
    }
  });
};

module.exports = weather;
