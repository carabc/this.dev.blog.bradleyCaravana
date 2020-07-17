const moment = require("moment");
const colors = require("colors");

function requestLogger(req, res, next) {
  // Use the NPM package 'moment' to format Date.now()
  const currentDate = moment(Date.now()).format("MMMM Do, YYYY");
  // Grab the HTTP method from the request (GET, POST, PUT, DELTE)
  const method = req.method;
  // Grab the destination on the url (/blog, /blog/:blogPostId)
  const url = req.url;
  // Grab the status code, 200 means everything is A-OK!
  const status = res.statusCode;
  // Piece together the data in a single string
  let logger = `[${currentDate}] ${method}: ${url} ${status}`;
  // Log it!
  console.log(logger.blue.bgWhite);
  // Call next so the request handles the next middleware down the line
  next();
}

module.exports = requestLogger;
