import assert from 'assert';
const rewire = require('rewire');
const Telemetry = require('../../models/telemetry');
const sinon = require('sinon');
require('sinon-as-promised');
const telemetryData = require('gomake-mock-data');
const TelemetryController = rewire('../../controllers/telemetry');

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

describe('Telemetry Controller', () => {
  describe('#getTelemetry - Gets latest telemetry item', () => {
    let req;
    let res;
    let revert;
    beforeEach((done) => {
      req = {
        params: {
          flightname: 'BATMAN-1'
        }
      };
      res = {
        sendStatus: () => {},
        json: () => {}
      };
      return done();
    });

    afterEach((done) => {
      revert();
      done();
    });

    it('should call checkTelemetryCache once', (done) => {
      const checkCacheSpy = sinon.spy();
      revert = TelemetryController.__set__('checkTelemetryCache', checkCacheSpy);
      TelemetryController.getTelemetry(req, res);
      sinon.assert.calledOnce(checkCacheSpy);
      done();
    });

    it('should attempt to pull latest telemetry from cache', (done) => {
      const telemetryCacheSpy = sinon.spy();
      revert = TelemetryController.__set__('telemetryCache', { get: telemetryCacheSpy });
      TelemetryController.getTelemetry(req, res);
      sinon.assert.calledOnce(telemetryCacheSpy);
      revert();
      done();
    });

    it('should send uncached telemetry if no cached value', (done) => {
      const onCacheResponse = TelemetryController.__get__('onCacheResponse');
      const callback = onCacheResponse('BATMAN-1', res);
      const noError = null;
      const spy = sinon.spy();
      revert = TelemetryController.__set__('sendUncachedTelemetry', spy);
      callback(noError);
      sinon.assert.calledOnce(spy);
      done();
    });

    it('should send cached telemetry if cached value found', (done) => {
      const onCacheResponse = TelemetryController.__get__('onCacheResponse');
      const callback = onCacheResponse('BATMAN-1', res);
      const noError = null;
      const cachedTelemetry = {};
      const stub = sinon.stub().returns(() => {});
      revert = TelemetryController.__set__('sendSuccessResponse', stub);
      callback(noError, cachedTelemetry);
      sinon.assert.calledOnce(stub);
      done();
    });

    it('should send an error response if a cache retrieval error occurs', (done) => {
      const onCacheResponse = TelemetryController.__get__('onCacheResponse');
      const callback = onCacheResponse('BATMAN-1', res);
      const error = 'error';
      const spy = sinon.spy();
      revert = TelemetryController.__set__('sendFailureResponse', spy);
      callback(error);
      sinon.assert.calledOnce(spy);
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
