'use strict';
const Parser = require('./parser.js');
const Telemetry = require('../../models/telemetry.js');
const Mappings = require('../maps/rockblock');
const Transforms = require('../transforms/rockblock');
const _ = require('lodash');

module.exports = class RockBlock extends Parser {
  getTelemetryFromBody(body) {
    let modifiedBody = body;
    // perform data cleaning before transforming
    if (Mappings._pre) {
      modifiedBody = Transforms[Mappings._pre](modifiedBody);
    }
    // perform individual transforms
    const mappingNames = _.keys(Mappings);
    const attributeNames = _.filter(mappingNames, (name) => name[0] !== '_');
    const attributes = _.pick(Mappings, attributeNames);
    const telemetry = _.reduce(attributes, this.reduceToTelemetryObject.bind(modifiedBody), {});
    // perform post data cleanup, if any
    if (Mappings._post) {
      modifiedBody = Transforms[Mappings._post](modifiedBody);
    }
    return new Telemetry(telemetry);
  }

  reduceToTelemetryObject(acc, telemetryAttribute, attributeName) {
    const body = this;
    const hasTransform = !!telemetryAttribute['transform'];
    const hasField = !!telemetryAttribute['field'];
    if (hasTransform && hasField) {
      const transformFunctionName = telemetryAttribute.transform;
      const transform = Transforms[transformFunctionName];
      const targetName = telemetryAttribute.field;
      const target = body[targetName];
      acc[attributeName] = transform(target);
    } else {
      if (hasField) {
        acc[attributeName] = body[telemetryAttribute.field];
      }
    }
    return acc;
  }
};
