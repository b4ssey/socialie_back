const winston = require("winston");
const logger = require("../middleware/logger");
require("express-async-errors");

module.exports = function () {
  logger.exceptions.handle(
    new winston.transports.Console({
      format: (winston.format.prettyPrint(), winston.format.colorize()),
    }),
    new winston.transports.File({ filename: "logs/exceptions.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
