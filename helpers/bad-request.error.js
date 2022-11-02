class BadRequestError extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.statusCode = 400;
    this.message = message || 'Bad Request - default msg';
  }
}

module.exports = { BadRequestError };
