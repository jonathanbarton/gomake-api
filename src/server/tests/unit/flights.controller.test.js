import chai from 'chai';
import { expect } from 'chai';
import assert from 'assert';
const makeMockgooseConnection = require('../../tests/mongooseMock/connection');
const Flight = require('../../models/flight');
const sinon = require('sinon');
require('sinon-mongoose');
require('sinon-as-promised');

chai.config.includeStack = true;

function addData(obj, callback) {
  Flight.ensureIndexes(() => {
    Flight.create(obj, callback);
  });
}

function updatedata(query, obj, callback) {
  Flight.update(query, obj, callback);
}

describe('Flights', () => {
  before((done) => {
    makeMockgooseConnection.connect(() => {
      done();
    });
  });

  describe('#Insert - Uniq contraint violation', () => {
    it('should create a new flight entry if uniq constraint is not violated', (done) => {
      addData({
        callSign: 'MAVERICK',
        flightNumber: 1
      }, (err, flight) => {
        expect(flight).to.have.property('callSign', 'MAVERICK');
        expect(flight).to.have.property('flightNumber', 1);
        done();
      });
    });

    it('should throw an error if uniq constraint is violated', (done) => {
      addData({
        callSign: 'MAVERICK',
        flightNumber: 1
      }, (err) => {
        const errorMessage = err.message;
        expect(errorMessage).to.be.equal(`E11000 duplicate key error dup` +
          ` key: { : "MAVERICK", : 1 }`);
        done();
      });
    });
  });

  describe('#Update - Uniq contraint violation', () => {
    before((done) => {
      addData({
        callSign: 'GOMAKE',
        flightNumber: 1
      }, () => {
        done();
      });
    });

    it('should throw an error if uniq constraint is violated', (done) => {
      const query = {
        callSign: 'GOMAKE'
      };
      updatedata(query, {
        callSign: 'MAVERICK',
        flightNumber: 1
      }, (err) => {
        const errorMessage = err.message;
        expect(errorMessage).to.be.equal(`E11000 duplicate key error dup` +
          ` key: { : "MAVERICK", : 1 }`);
        done();
      });
    });

    it('should update if uniq constraint is not violated', (done) => {
      const query = {
        callSign: 'MAVERICK'
      };
      updatedata(query, {
        flightNumber: 2
      }, (err, result) => {
        const successMessage = result.ok;
        expect(successMessage).to.be.equal(1);
        done();
      });
    });
  });

  describe('#List - Model method that returns the list of flights from the db', () => {
    it('should return the list of flights', (done) => {
      const FlightMock = sinon.mock(Flight);
      const skip = 0;
      const limit = 5000;

      FlightMock
      .expects('find')
      .chain('sort')
      .chain('skip').withArgs(skip)
      .chain('limit').withArgs(limit)
      .chain('exec')
      .resolves('Resolved');

      Flight.list(limit, skip)
      .then((res) => {
        FlightMock.verify();
        FlightMock.restore();
        assert.equal('Resolved', res);
        done();
      });
    });
  });

  describe('#GetFlights -Ctrl method that calls the Flight model which retunrs flights', () => {
    let req;
    let res;
    let fakeData;
    let FlightController;

    beforeEach((done) => {
      FlightController = require('../../controllers/flights');
      req = {};
      res = {};
      fakeData = 11;
      done();
    });

    afterEach((done) => {
      Flight.list.restore();
      done();
    });

    it('should call Flight.list (model) method which returns data ', (done) => {
      sinon.stub(Flight, 'list').returns({
        then: () => {
          const fake = 11;
          return fake;
        }
      });
      const resolvedStub = FlightController.getFlights(req, res);
      assert.equal(resolvedStub, fakeData);
      done();
    });

    it('should call Flight.list (model) method with skip 0 and limit 50', (done) => {
      const spy = sinon.spy(Flight, 'list');
      FlightController.getFlights(req, res);
      assert(spy.calledWith(50, 0));
      done();
    });
  });
});
