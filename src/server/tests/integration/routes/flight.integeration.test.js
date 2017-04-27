import request from 'superagent';
import assert from 'assert';
import chai from 'chai';
import _prefix from 'superagent-prefix';
const prefix = _prefix(process.env.GM_API_BASE_URL);

const generateJwtToken = require('../../utils/jwt').generateJwtToken;
chai.config.includeStack = true;

describe('#Flights ', () => {
  describe('# GET flight/:flightName', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request
        .get('/flight/DUMMY-1')
        .use(prefix)
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 200 , for valid jwt ', (done) => {
      const token = generateJwtToken();
      request
        .get('/flight/DUMMY-1')
        .use(prefix)
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
      request
        .post('/flight/DUMMY-1')
        .use(prefix)
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 400 , for valid jwt  but missing body', (done) => {
      const token = generateJwtToken();
      request
        .post('/flight/DUMMY-1')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
    it('should return 303 , for valid body but duplicate request', (done) => {
      const token = generateJwtToken();
      request
        .post('/flight/MAVERICK-1')
        .use(prefix)
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
      request
        .put('/flight/MAVERICK-1')
        .use(prefix)
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
      request
        .put('/flight/MAVERICK-1/user/google|123')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
    it('should return 400 , if jwt does not have userId ', (done) => {
      const token = generateJwtToken();
      request
        .put('/flight/MAVERICK-1/user/google|123')
        .use(prefix)
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
      request
        .put('/flight/MAVERICK-100/user/google|123')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
  });

  describe('# DELETE flight/:flightName/user/:userId', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request
        .delete('/flight/MAVERICK-1/user/google|123')
        .use(prefix)
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
      request
        .delete('/flight/MAVERICK-1/user/google|123')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
    it('should return 400 , if jwt does not have userId ', (done) => {
      const token = generateJwtToken();
      request
        .delete('/flight/MAVERICK-1/user/google|123')
        .use(prefix)
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
      request
        .delete('/flight/MAVERICK-100/user/google|123')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 400);
          done();
        });
    });
  });
});
