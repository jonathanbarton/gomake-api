'use strict';
const Parser = require('./parser.js');
const Telemetry = require('../../models/telemetry.js');
const Mappings = require('../maps/rockblock');
const Transforms = require('../transforms/rockblock');

module.exports = class RockBlock extends Parser {
  getTelemetryFromBody(body) {
    let modifiedBody = body;
    // perform data cleaning before transforming
    if (Mappings._pre) {
      modifiedBody = Transforms[Mappings._pre](modifiedBody);
    }
    // perform individual transforms
    const telemetry = Mappings
      .filter((telemetryAttribute) => telemetryAttribute[0] !== '_')
      .reduce(this.reduceToTelemetryObject.bind(modifiedBody), {});
    // perform post data cleanup, if any
    if (Mappings._post) {
      modifiedBody = Transforms[Mappings._post](modifiedBody);
    }

    return new Telemetry(telemetry);
  }

  reduceToTelemetryObject(acc, telemetryAttribute) {
    const body = this;
    const hasTransform = !!Mappings[telemetryAttribute].transform;
    const hasField = !!Mappings[telemetryAttribute].field;
    if (hasTransform && hasField) {
      const transformFunctionName = Mappings[telemetryAttribute].transform;
      const transform = Transforms[transformFunctionName];
      const targetName = Mappings[telemetryAttribute].field;
      const target = body[targetName];
      acc[telemetryAttribute] = transform(target);
    } else {
      if (hasField) {
        acc[telemetryAttribute] = Mappings[telemetryAttribute].field;
      }
    }
  }
};
