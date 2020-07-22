const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const requestLogger = require("./middleware/requestLogger");
const setResVariables = require("./middleware/setResVariables");
const fileupload = require("express-fileupload");
const methodOverride = require("method-override");
const errorHandler = require("./middleware/error");
const initPassport = require("./config/passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Init express
const app = express();

// Load config
dotenv.config({ path: "./config/config.env" });

// Connect to mongoDB
connectDB();

// Initialize static folder for express and static html/css files
app.use(express.static(path.join(__dirname, "/public")));

// Passport config
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
          };
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Handlebars helpers
const {
  formatDate,
  truncate,
  makeNewPostButton,
  stripTagsAndTruncate,
  makeEditPostButton,
} = require("./helpers/hbs");

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
      makeNewPostButton,
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

// Incase I want to send JSON in the body (although it isn't being used as of right now)
app.use(express.json());

// File uploading
app.use(fileupload());

// Method Overrides
app.use(methodOverride("_method"));

// Check if there is a signed in user, and if the user is me. Set variables on res.locals accordingly.
app.use(setResVariables);

// Routes
app.use("/blog", require("./routes/blog"));
app.use("/contact", require("./routes/contact"));

// Error handler middleware
// app.use(errorHandler);

// Passport routes
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
