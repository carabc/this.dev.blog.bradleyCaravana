const moment = require("moment");
const colors = require("colors");

function requestLogger(req, res, next) {
  const currentDate = moment(Date.now()).format("MMMM Do, YYYY");
  const method = req.method;
  const url = req.url;
  const status = res.statusCode;
  let logger = `[${currentDate}] ${method}: ${url} ${status}`;
  console.log(logger.blue.bgWhite);
  next();
}

module.exports = requestLogger;
