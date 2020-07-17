const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const colors = require("colors");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const requestLogger = require("./middleware/requestLogger");
const fileupload = require("express-fileupload");
const methodOverride = require("method-override");

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
  // testIfImLoggedIn,
  makeNewPostButton,
  // makeLogOutButton,
  stripTagsAndTruncate,
  makeEditPostButton,
} = require("./helpers/hbs");
const e = require("express");
// Initialize handlebars view engine
app.engine(
  ".hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "index.hbs",
    partialsDir: [path.join(__dirname, "views/partials")],
    helpers: {
      formatDate,
      truncate,
      // testIfImLoggedIn,
      makeNewPostButton,
      // makeLogOutButton,
      stripTagsAndTruncate,
      makeEditPostButton,
    },
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

// Initialize homemade logger (delicious!)
app.use(requestLogger);

// Initialize built in body parser for express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// File uploading
app.use(fileupload());

// Method Overrides
app.use(methodOverride("_method"));

// See if the logged in user is ME
app.use(function (req, res, next) {
  // set res.locals.isAuthenticated to either true or false. If a user is signed in, res.locals.isAuthenticated is equal to true.
  res.locals.isAuthenticated = req.isAuthenticated();
  // Check if there is a signed in user, if not, go to the next middleware
  if (!res.locals.isAuthenticated) {
    return next();
  } else {
    res.locals.user = req.user || null;
  }
  // Check if the signed in user is me, if it is, set a bunch of variables to true. IF not, set them to false.
  if (req.user.googleId === process.env.GOOGLE_ACCOUNT_ID) {
    res.locals.showPlus = true;
    res.locals.showEdit = true;
    res.locals.showDelete = true;
  } else {
    res.locals.showPlus = false;
    res.locals.showEdit = false;
    res.locals.showDelete = false;
  }
  return next();
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
