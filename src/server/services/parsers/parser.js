'use strict';

const ABSTRACT_TYPE_ERROR = 'Error: Attempting to instantiate/call abstract class Parser';
module.exports = class Parser {
  constructor() {
    if (this.constructor === Parser) {
      throw new TypeError(ABSTRACT_TYPE_ERROR);
    }
  }

  getTelemetryFromBody() {
    throw new TypeError(ABSTRACT_TYPE_ERROR);
  }
};
