class Forbidden403 extends Error {
  constructor(message, statusCode) {
    super(); // super(message)
    this.name = this.constructor.name;
    this.statusCode = statusCode || 403;
    this.message = message || 'Forbidden! - default msg';
  }
}

module.exports = { Forbidden403 };
