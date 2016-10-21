import assert from 'assert';
const Telemetry = require('../../models/telemetry');
const sinon = require('sinon');
require('sinon-as-promised');
const telemetryData = require('gomake-mock-data');
const TelemetryController = require('../../controllers/telemetry');

describe('Telemetry Model', () => {
  describe('#findOne', () => {
    it('should return telemetry data', (done) => {
      const TelemetryMock = sinon.mock(Telemetry);
      const mockTelemetryItem = telemetryData.get('telemetry', 'goodTelemetry', 1)[0];
      TelemetryMock.expects('findOne').withArgs().resolves(mockTelemetryItem);
      Telemetry.findOne().then((res) => {
        TelemetryMock.verify();
        TelemetryMock.restore();
        assert.equal(mockTelemetryItem, res);
        done();
      });
    });
  });
});

describe('Telemetry', () => {
  describe('#getTelemetry - Gets latest telemetry item', () => {
    let req;
    let res;
    beforeEach((done) => {
      req = {
        params: {
          flightname: 'gomake-1'
        }
      };
      res = {
        sendStatus: () => {

        }
      };
      return done();
    });

    afterEach((done) => {
      Telemetry.findOne.restore();
      done();
    });

    it('should return single telemetry object', (done) => {
      const mockTelemetryItem = telemetryData.get('telemetry', 'goodTelemetry', 1);
      sinon.stub(Telemetry, 'findOne').returns({
        then: () => {
          return mockTelemetryItem;
        }
      });
      const resolvedTelemetry = TelemetryController.getTelemetry(req, res);
      assert.equal(resolvedTelemetry, mockTelemetryItem);
      done();
    });

    it('should send an error status when an error occurs', (done) => {
      sinon.stub(Telemetry, 'findOne').rejects('error')().catch((error) => {
        assert.equal(error.message, 'error');
        done();
      });
      TelemetryController.getTelemetry(req, res);
    });
  });
});
