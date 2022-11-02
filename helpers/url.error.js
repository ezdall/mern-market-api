class UrlError extends Error {
  constructor(message, statusCode) {
    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode || 404;
    this.message = message || 'Url Error - default msg';
  }
}

module.exports = { UrlError };
