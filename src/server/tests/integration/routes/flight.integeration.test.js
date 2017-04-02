import request from 'supertest';
import assert from 'assert';
import chai from 'chai';
import app from '../../../../index';
const generateJwtToken = require('../../utils/jwt').generateJwtToken;
chai.config.includeStack = true;

describe('#Flights ', () => {
  describe('# GET flight/:flightName', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request(app)
        .get('/flight/DUMMY-1')
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 200 , for valid jwt ', (done) => {
      const token = generateJwtToken();
      request(app)
        .get('/flight/DUMMY-1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          assert.equal(response.text.content, null);
          done();
        });
    });
  });

  describe('# POST flight/:flightName', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request(app)
        .post('/flight/DUMMY-1')
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 400 , for valid jwt  but missing body', (done) => {
      const token = generateJwtToken();
      request(app)
        .post('/flight/DUMMY-1')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
    it('should return 303 , for valid body but duplicate request', (done) => {
      const token = generateJwtToken();
      request(app)
        .post('/flight/MAVERICK-1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          callSign: 'MAVERICK',
          flightNumber: 1,
          launchStartDateTime: '2016-10-15T22:28:06.054Z',
          launchLocation: JSON.stringify({
            type: 'Point',
            coordinates: [
              107.8543, -41.123
            ]
          }),
          launchAltitude: 70,
          registeredTrackers: JSON.stringify([1, 2]),
          deviceIds: JSON.stringify([312236995699570])
        })
        .end((err, response) => {
          assert.equal(response.statusCode, 303);
          done();
        });
    });
  });

  describe('# PUT flight/:flightName/user/:userId', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request(app)
        .put('/flight/MAVERICK-1')
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 200 , for valid jwt ', (done) => {
      const hasUserId = true;
      const hasExpiration = false;
      const token = generateJwtToken(hasExpiration, hasUserId);
      request(app)
        .put('/flight/MAVERICK-1/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
    it('should return 400 , if jwt does not have userId ', (done) => {
      const token = generateJwtToken();
      request(app)
        .put('/flight/MAVERICK-1/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });

    it('should return 400 , if jwt has  userId , but flight is not valid ', (done) => {
      const hasUserId = true;
      const hasExpiration = false;
      const token = generateJwtToken(hasExpiration, hasUserId);
      request(app)
        .put('/flight/MAVERICK-100/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
  });

  describe('# DELETE flight/:flightName/user/:userId', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request(app)
        .delete('/flight/MAVERICK-1/user/google|123')
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 200 , for valid jwt ', (done) => {
      const hasUserId = true;
      const hasExpiration = false;
      const token = generateJwtToken(hasExpiration, hasUserId);
      request(app)
        .delete('/flight/MAVERICK-1/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
    it('should return 400 , if jwt does not have userId ', (done) => {
      const token = generateJwtToken();
      request(app)
        .delete('/flight/MAVERICK-1/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });

    it('should return 400 , if jwt has  userId , but flight is not valid ', (done) => {
      const hasUserId = true;
      const hasExpiration = false;
      const token = generateJwtToken(hasExpiration, hasUserId);
      request(app)
        .delete('/flight/MAVERICK-100/user/google|123')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
  });
});
