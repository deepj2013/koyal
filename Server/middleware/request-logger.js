const { log, logToFile } = require("../support/logger");
import logToFile from "../utils/logger.js";

module.exports = async (req, res, next) => {
  console.log("--------- req.body logging ---------------");
  console.log(req.body);

  const requestLog = {
    date: new Date(),
    logType: "REQUEST_LOG",
    env: process.env.NODE_ENV,
    level: "info",
    api: req.url,
    method: req.method,
    body: req.body,
    client: req.ip,
    customerId: req.customerId ? req.customerId : "Customer not available!",
    // stack: err.stack,
  };
  logToFile.log(requestLog);
  console.log("log.error(requestLog)------------------");
  log.error(JSON.stringify(requestLog));

  next();
};
