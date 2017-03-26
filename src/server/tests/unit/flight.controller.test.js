import assert from 'assert';
const Flight = require('../../models/flight');
require('sinon-mongoose');
const sinon = require('sinon');
const sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon);
require('sinon-as-promised');

describe('Flight', () => {
  const findByArgs = {
    callSign: 'GOMAKE',
    flightNumber: 1
  };
  const FlightController = require('../../controllers/flight');
  let FlightMock;
  let req;
  let res;
  let flightModelStub;
  let responseSpy;

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
    beforeEach((done) => {
      flightModelStub = sinon.stub(Flight, 'findOne').returnsPromise();
      req = {
        params: {
          flightname: 'gomake-1'
        },
        user: {
          user_id: 'google|12345'
        }
      };
      res = {
        json: () => {},
        sendStatus: () => {}
      };
      responseSpy = sinon.spy(res, 'json');
      FlightController.getFlightInfo(req, res);
      done();
    });

    afterEach((done) => {
      Flight.findOne.restore();
      res.json.restore();
      done();
    });

    it('should call Flight.findOne (model) which returns a resolved promise ', (done) => {
      flightModelStub.resolves('resolved');

      flightModelStub().then((arg) => {
        assert(responseSpy.calledOnce);
        assert.equal(arg, 'resolved');
        done();
      });
    });

    it('should call Flight.findOne (model)  which returns a rejected promise  ', (done) => {
      flightModelStub.rejects('rejected');

      flightModelStub().then(() => {}, (arg) => {
        assert(responseSpy.calledOnce);
        assert.equal(arg, 'rejected');
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

  describe('#putUserInFlight', () => {
    it('should find and update flight with user_id from JWT', (done) => {
      sinon.stub(Flight, 'findOneAndUpdate')
        .returns(Promise.resolve(11));
      FlightController.putUserInFlight(req, res)
        .then((result) => {
          assert.equal(result, 11);
          done();
        });
    });
  });
});
