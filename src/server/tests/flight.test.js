import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';
const should = require('should');
import mongoMock from '../../../src/server/tests/mongoMock/connection';

chai.config.includeStack = true;

describe('Flights', () => {
  let collection;
  let connectedDb;
  let dbName;

  before((done) => {
    mongoMock.connect((err, db, databaseName) => {
      connectedDb = db;
      dbName = databaseName;
      collection = connectedDb.collection('flights');
      done();
    });
  });

  describe('#Indexes', () => {
    it('should create a unique index on callSign and flightNumber', (done) => {
      collection.createIndex({
        callSign: 1,
        flightNumber: 1
      }, {
        unique: true
      }, (err, name) => {
        if (err) {
          return done(err);
        }
        should(name).be.exactly('callSign_1_flightNumber_1');
        done();
      });
    });
  });


  describe('#Unique constraint violations on insert', () => {
    let error;
    let result;
    before((done) => {
      collection.insert([{
        callSign: 'MAVERICK',
        flightNumber: 1
      }, {
        callSign: 'GOMAKE',
        flightNumber: 1,
        launchAltitude: 80
      }, {
        callSign: 'GOMAKE',
        flightNumber: 1,
        launchAltitude: 70
      }, {
        callSign: 'GOMAKE',
        flightNumber: 2
      }], (err, res) => {
        error = err;
        result = res;
        done();
      });
    });

    it('error should be true', (done) => {
      should(!!error).be.exactly(true);
      done();
    });

    it('result should be false', (done) => {
      should(!!result).be.exactly(false);
      done();
    });

    it('error message E11000 duplicate key error index should be thrown', (done) => {
      error.message.should.equal(`E11000 duplicate key error index: ` +
       `${dbName}.flights.$callSign_1_flightNumber_1`);
      done();
    });
  });

  describe('#Unique constraint insert should not find duplicated value on find', () => {
    let record;
    before((done) => {
      collection.findOne({
        callSign: 'GOMAKE',
        flightNumber: 1
      }, (err, doc) => {
        record = doc;
        if (err) {
          return done(err);
        }
        done();
      });
    });

    it('record should be true', (done) => {
      should(!!record).be.exactly(true);
      done();
    });

    it('record should have the differentiating property for the original', (done) => {
      should(record).have.property('launchAltitude', 80);
      done();
    });

    it('record should not have the differentiating property for the duplicate', (done) => {
      should(record).not.have.property('launchAltitude', 70);
      done();
    });
  });

  describe('#Unique constraint violations on update', () => {
    let error;
    before((done) => {
      collection.update({
        callSign: 'MAVERICK'
      }, {
        $set: {
          callSign: 'GOMAKE',
          flightNumber: 1,
          random: 'yo'
        }
      }, (err) => {
        error = err;
        done();
      });
    });

    it('error should be true', (done) => {
      should(!!error).be.exactly(true);
      done();
    });

    it('error message E11000 duplicate key error index should be thrown', (done) => {
      error.message.should.equal(`E11000 duplicate key error index: ` +
        `${dbName}.flights.$callSign_1_flightNumber_1`);
      done();
    });
  });

  describe('#Unique constraint update should not find duplicated value on find', () => {
    let record;
    before((done) => {
      collection.findOne({
        callSign: 'GOMAKE',
        flightNumber: 1
      }, (err, doc) => {
        record = doc;
        if (err) {
          return done(err);
        }
        done();
      });
    });

    it('record should be true', (done) => {
      should(!!record).be.exactly(true);
      done();
    });

    it('record should have the differentiating property for the original', (done) => {
      should(record).have.property('launchAltitude', 80);
      done();
    });

    it('record should not have the differentiating property for the duplicate', (done) => {
      should(record).not.have.property('random');
      done();
    });
  });

  describe('#GET /flights', () => {
    it('should get details of all the flights', () => {
      request(app)
        .get('/flights')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.content).to.be.an('array');
        });
    });
    it('should return 404 if URI was not found', () => {
      request(app)
        .get('/api/flights')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
