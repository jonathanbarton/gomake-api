'use strict';

import chalk from 'chalk';
const logPrefix = 'TRACKING:';

const logger = {
  logAuthenticationSuccess(req) {
    console.log(chalk.green(`${logPrefix} USER# ${req.user.user_id} was authenticated while ` +
      `attempting to perform a ${req.method} to endpoint ${req.originalUrl}.`));
  },

  logAuthenticationDenial(req) {
    console.log(chalk.red(`${logPrefix} A user was not authenticated and ` +
      `was denied access to perform a ${req.method} to endpoint ${req.originalUrl}.`));
  },

  logFailure(err) {
    console.log(chalk.red(`Request failed with error ${err}`));
  }
};

module.exports = logger;
