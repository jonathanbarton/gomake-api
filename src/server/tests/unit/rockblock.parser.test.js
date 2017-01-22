import assert from 'assert';
const rewire = require('rewire');
require('sinon-as-promised');
const RockBlockParser = rewire('../../services/parsers/rockblock');

describe('RockBlock Parser', () => {
  describe('getTelemetryFromBody', () => {
    it('should transform telemetry from POST body to Telemetry model', (done) => {
      const body = {
        transmit_time: '2017-01-22T02:52:45Z UTC',
        data: '6c617469747564653d34322e333334373136' // 'latitude=42.334716'
      };
      const parser = new RockBlockParser();
      const result = parser.getTelemetryFromBody(body);
      assert.equal(typeof result, 'object');
      done();
    });
  });
});
