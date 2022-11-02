const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000', // react

  // no internet
  'null'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = { corsOptions };
