import assert from 'assert';
const rewire = require('rewire');
// const sinon = require('sinon');
require('sinon-as-promised');
const RockBlockTransform = rewire('../../services/transforms/rockblock');

describe('RockBlock Transforms', () => {
  describe('convertDataToObject', () => {
    it('should convert data item from hex to ascii', (done) => {
      const body = {
        data: '6c617469747564653d34322e333334373136' // 'latitude=42.334716'
      };
      const expectedResult = '42.334716';
      const result = RockBlockTransform.convertDataToObject(body);
      assert.equal(result.data.latitude, expectedResult);
      done();
    });
  });
  describe('getSensorData', () => {
    it('should return an object with sensor attributes', (done) => {
      const field = {
        Sound: 100,
        Barometer: 200,
        Temperature: 20
      };
      const result = RockBlockTransform.getSensorData(field);
      assert.equal(result.sound, 100);
      assert.equal(result.barometer, 200);
      done();
    });
  });
});
