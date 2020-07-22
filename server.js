const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const path = require("path");
const requestLogger = require("./middleware/requestLogger");
const findUserInToken = require("./middleware/findUserInToken");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

// Init express
const app = express();

// Load config
dotenv.config({ path: "./config/config.env" });

// Connect to mongoDB
connectDB();

// Initialize static folder for express and static html/css files
app.use(express.static(path.join(__dirname, "/public")));

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

// Initialize homemade logger (delicious!)
app.use(requestLogger);

// Initialize built in body parser for express
app.use(express.urlencoded({ extended: false }));

// Incase I want to send JSON in the body (used for auth testing using JWT)
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Method Overrides
app.use(methodOverride("_method"));

// Find the user in the JWT, if there is one
app.use(findUserInToken);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/contact", require("./routes/contact"));
app.use("/blog", require("./routes/blog"));

// Error handler middleware
// app.use(errorHandler);

// Route for the homepage, send the client the static homepage
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// Initialize the port to listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}...`.blue.bgWhite)
);
