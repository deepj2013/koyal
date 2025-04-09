import rateLimit from "express-rate-limit";

module.exports.limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 2 minutes
  max: 50, // Limit each IP to 5 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    statusCode: 429,
    message: "Too many requests, please try again later.",
    data: {},
  },
});
