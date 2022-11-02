class NotFoundError extends Error {
  constructor(message, statusCode) {
    super(); // super(message)
    this.name = this.constructor.name;
    this.statusCode = statusCode || 404;
    this.message = message || 'Not Found error - default msg';
  }
}

module.exports = { NotFoundError };
