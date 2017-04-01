'use strict';

const winston = require('../../config/winston');
const chalk = require('chalk');
const infoPrefix = 'TRACKING:';
const errorPrefix = 'ERROR:';

const logger = {
  logAuthenticationSuccess(req) {
    winston.log('info', chalk.cyan(`${infoPrefix} USER# ${req.user.user_id} was ` +
      `authenticated while attempting to perform a ${req.method} to endpoint ${req.originalUrl}.`));
  },

  logAuthenticationDenial(req) {
    winston.log('info', chalk.cyan(`${infoPrefix } A user was not authenticated and ` +
      `was denied access to perform a ${req.method} to endpoint ${req.originalUrl}.`));
  },

  logFailure(err) {
    winston.log('error', chalk.red(`${errorPrefix} Request failed with error ${err}`));
  }
};

module.exports = logger;
