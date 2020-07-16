const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const colors = require("colors");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
const moment = require("moment");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// Init express
const app = express();
// Connect to mongoDB
connectDB();
// Initialize static folder for express and static html/css files
app.use(express.static(path.join(__dirname, "/public")));
// Passport config
require("./config/passport")(passport);
// Handlebars helpers
const {
  formatDate,
  truncate,
  testIfImLoggedIn,
  makeNewPostButton,
} = require("./helpers/hbs");
// Initialize handlebars view engine
app.engine(
  ".hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "index.hbs",
    partialsDir: [path.join(__dirname, "views/partials")],
    helpers: { formatDate, truncate, testIfImLoggedIn, makeNewPostButton },
  })
);
app.set("view engine", ".hbs");
// Initialize express session middleware
app.use(
  session({
    secret: "ralphies butt",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Initalize morgan
app.use(morgan());
// Initialize built in body parser for express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Set global user var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
// Routes
app.use("/blog", require("./routes/blog"));
app.use("/auth", require("./routes/auth"));

// Route for the homepage, send the client the static homepage
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// Initialize the port to listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}...`.blue.bgWhite)
);
