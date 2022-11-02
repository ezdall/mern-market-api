const mongoose = require('mongoose');

async function connectMDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI_MARKET, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    const { name, host, port } = conn.connection;

    console.log(
      `MongoDB Connected: ${host}:${port}/${name} pid:${process.pid}`
    );
  } catch (error) {
    console.error(`Error-at-Connection: ${error.stack}`);
    process.exit(0); // exit 0-to clean exit, 1- app crash
  }
}

module.exports = { connectMDB };
