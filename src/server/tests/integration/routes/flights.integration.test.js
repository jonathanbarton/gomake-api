import request from 'superagent';
import assert from 'assert';
import chai from 'chai';
import _prefix from 'superagent-prefix';
const prefix = _prefix(process.env.GM_API_BASE_URL);

const generateJwtToken = require('../../utils/jwt').generateJwtToken;
chai.config.includeStack = true;

describe('#Flights ', () => {
  describe('# GET /flights', () => {
    it('should return 401 , if no jwt in request ', (done) => {
      request
        .get('/flights')
        .use(prefix)
        .end((err, response) => {
          assert.equal(response.statusCode, 401);
          assert.equal(response.text, 'Unauthorized');
          done();
        });
    });
    it('should return 500 , if no jwt does not have user_id ', (done) => {
      const token = generateJwtToken();
      request
        .get('/flights')
        .use(prefix)
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
      request
        .get('/flights')
        .use(prefix)
        .set('Authorization', `Bearer ${token}`)
        .end((err, response) => {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
  });
});
