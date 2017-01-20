import path from 'path';
const env = process.env.NODE_ENV || 'development';

let config;
if (typeof process.env.GM_DOCKER !== 'undefined') {
  config = require('./docker');
} else {
  require('dotenv').config();
  config = require(`./${env}`);
}

const defaults = {
  root: path.join(__dirname, '/..')
};

export default Object.assign(defaults, config);
