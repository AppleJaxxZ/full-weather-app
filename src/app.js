const path = require("path");
const express = require("express");
const hbs = require("hbs");
const dotenv = require("dotenv");
const geocode = require("./utils/geocode");
const weather = require("./utils/weather");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//EDefines paths for express config
//poionts to the directory which our static files will be served from.
const publicDirectoryPath = path.join(__dirname, "../public");
//creates a variable that points to where the hbs fiiles will be served from for view.
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Set up handlebars engine and views location
//enables app to use hbs view engine.
app.set("view engine", "hbs");
//uses the new path variable for hbs templates dir
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//tells express to serve our static files from this directory path
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  //render is used for dynamic files in hbs
  res.render("index", {
    title: "Weather",
    sub: "Simple, Easy, Fast Forecasts For Your Area.",
    name: "Alex Zajacek",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Alex Zajacek",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "This is the Help Page",
    info: "HELP",
    name: "Alex Zajacek",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Please provide an address." });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({ error });
        }

        weather(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }
          res.send({
            Location: location,
            forecast: forecastData,
          });
        });
      }
    );
  }
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({ products: [] });
});

//Matches 404's after the help endpoint
app.get("/help/*", (req, res) => {
  res.render("404", { PageNotFound: "Help Aricle Not Found" });
});

// the star means match anythiong that hasent been made so far.
app.get("*", (req, res) => {
  res.render("404", {
    PageNotFound: "404 Page Not Found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
