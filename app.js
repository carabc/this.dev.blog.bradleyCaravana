const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const colors = require("colors");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");

// Init express
const app = express();
// Connect to mongoDB
connectDB();
// Initialize handlebars view engine
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "index.hbs",
  })
);
app.set("view engine", ".hbs");
// Initalize morgan
app.use(morgan());
// Initialize built in body parser for express
app.use(express.urlencoded({ extended: false }));

app.use("/blog", require("./routes/blog"));
app.use(express.static(path.join(__dirname, "public")));

// Route for the homepage, send the client the static homepage
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// Initialize the port to listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}...`.blue.bgWhite)
);
