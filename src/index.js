import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';
import winston from './config/winston';
const path = require('path');

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
winston.log('info', 'gomake-api service started');

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  winston.log('error', `Timestamp: ${new Date()} | ` +
    `Unable to connect to database: ${config.db} | ` +
    `Retrying in 2 seconds.`);
  setTimeout(() => {
    mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
  }, 2000);
});

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');


// listen on port config.port
app.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`);
});

export default app;
