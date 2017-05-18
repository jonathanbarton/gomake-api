const assert = require('assert');
const Flight = require('../../../models/flight');
require('sinon-mongoose');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
const FlightController = require('../../../controllers/flight');
sinonStubPromise(sinon);
require('sinon-as-promised');

describe('Flight', () => {
  const req = {
    params: {
      flightname: 'gomake-1'
    },
    user: {
      user_id: 'google|12345'
    }
  };
  const res = {
    ok: () => {},
    badRequest: () => {},
    serverError: () => {}
  };
  const findByArgs = {
    callSign: 'GOMAKE',
    flightNumber: 1
  };
  let FlightMock;
  let flightModelStub;
  let resOkSpy;
  let resServerErrorSpy;
  let resBadRequestSpy;

  describe('#findOne - Model method that returns flightData from db,if present', () => {
    beforeEach((done) => {
      FlightMock = sinon.mock(Flight);
      done();
    });

    afterEach((done) => {
      FlightMock.verify();
      FlightMock.restore();
      done();
    });

    it('should resolve a promise and return flightInfo if present', (done) => {
      FlightMock
        .expects('findOne').withArgs(findByArgs)
        .resolves('Resolved');

      Flight.findOne(findByArgs)
        .then((success) => {
          assert.equal('Resolved', success);
          done();
        });
    });
  });

  describe('#GetFlightInfo -Ctrl method that calls findOne which returns flightInfo', () => {
    before((done) => {
      flightModelStub = sinon.stub(Flight, 'findOne').returnsPromise();
      FlightController.getFlightInfo(req, res);
      done();
    });

    after((done) => {
      Flight.findOne.restore();
      done();
    });

    it('should call Flight.findOne (model) which returns a resolved promise ', (done) => {
      resOkSpy = sinon.spy(res, 'ok');
      flightModelStub.resolves('resolved');

      flightModelStub().then((arg) => {
        assert(resOkSpy.calledOnce);
        assert.equal(arg, 'resolved');
        resOkSpy.restore();
        done();
      });
    });

    it('should call Flight.findOne (model)  which returns a rejected promise  ', (done) => {
      resServerErrorSpy = sinon.spy(res, 'serverError');
      flightModelStub.rejects('rejected');

      flightModelStub().then(() => {}, (arg) => {
        assert(resServerErrorSpy.calledOnce);
        assert.equal(arg, 'rejected');
        resServerErrorSpy.restore();
        done();
      });
    });
  });

  describe('#GetFlightInfo -Ctrl method that calls findOne which returns flightInfo', () => {
    it('should call Flight.findOne (model) method with callSign and flightNumber', (done) => {
      const flightSpy = sinon.spy(Flight, 'findOne');
      FlightController.getFlightInfo(req, res);
      assert(flightSpy.calledWith(findByArgs));
      done();
    });
  });

  describe('#PutUserInFlight', () => {
    beforeEach((done) => {
      resOkSpy = sinon.spy(res, 'ok');
      resBadRequestSpy = sinon.spy(res, 'badRequest');
      done();
    });
    afterEach((done) => {
      resOkSpy.restore();
      resBadRequestSpy.restore();
      done();
    });

    it('should find and update flight with user_id provided', (done) => {
      sinon.stub(Flight, 'findOneAndUpdate')
        .returns(Promise.resolve(11));
      FlightController.putUserInFlight(req, res)
        .then(() => {
          assert(resOkSpy.calledWith(res));
          Flight.findOneAndUpdate.restore();
          done();
        });
    });
  });

  describe('#DeleteUserInFlight', () => {
    beforeEach((done) => {
      resOkSpy = sinon.spy(res, 'ok');
      resBadRequestSpy = sinon.spy(res, 'badRequest');
      done();
    });
    afterEach((done) => {
      resOkSpy.restore();
      resBadRequestSpy.restore();
      done();
    });
    it('should find and remove user_id provided from specified flight', (done) => {
      req.user = {
        user_id: 'google|12345'
      };
      sinon.stub(Flight, 'findOneAndUpdate')
        .returns(Promise.resolve(11));
      FlightController.deleteUserInFlight(req, res)
        .then(() => {
          assert(resOkSpy.calledWith(res));
          Flight.findOneAndUpdate.restore();
          done();
        });
    });
  });
});
