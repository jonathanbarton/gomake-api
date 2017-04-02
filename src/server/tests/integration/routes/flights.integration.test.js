import request from 'supertest';
import assert from 'assert';
import chai from 'chai';
import app from '../../../../index';
const generateJwtToken = require('../../utils/jwt').generateJwtToken;
chai.config.includeStack = true;

describe('#Flights ', () => {
  describe('# GET /flights', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request(app)
        .get('/flights')
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 500 , if no jwt does not have user_id ', (done) => {
      const token = generateJwtToken();
      request(app)
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 500);
          done();
        });
    });
    it('should return flights , if jwt has flights for  given user_id ', (done) => {
      const hasExpiration = false;
      const hasUserId = true;
      const token = generateJwtToken(hasExpiration, hasUserId);
      request(app)
        .get('/flights')
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
  });
});
