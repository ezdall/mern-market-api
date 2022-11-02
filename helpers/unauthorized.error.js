class Unauthorized401 extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.statusCode = 401;
    this.message = message || 'Unauthorized - default msg';
  }
}

module.exports = { Unauthorized401 };
