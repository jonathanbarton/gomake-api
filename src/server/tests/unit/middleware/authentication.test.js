import authentication from '../../../middleware/authentication';
const assert = require('assert');
const sinon = require('sinon');
const config = require('../../../../../src/config/env');
const jwt = require('jsonwebtoken');

let sendAuthenticationFailureStatusSpy;
let sendAuthenticationFailureJsonSpy;
let token;

const req = {
  headers: {},
  query: {},
  user: {}
};

const res = {
  status: () => {},
  json: () => {}
};

describe('Authentication ', () => {
  before((done) => {
    sendAuthenticationFailureStatusSpy = sinon.spy(res, 'status');
    sendAuthenticationFailureJsonSpy = sinon.spy(res, 'json');
    done();
  });

  after((done) => {
    sendAuthenticationFailureStatusSpy.restore();
    sendAuthenticationFailureJsonSpy.restore();
    done();
  });
  describe('authentication() : when failure', () => {
    it('should send unauthorised if header or query  does not have token', (done) => {
      authentication(req, res, done);

      assert(sendAuthenticationFailureStatusSpy.calledWith(401));
      assert(sendAuthenticationFailureJsonSpy.calledWith({
        message: 'Unauthorised'
      }));
      done();
    });

    it('should send unauthorised if header has expired token', (done) => {
      const hasExpiration = true;
      token = generateJwtToken(hasExpiration);
      req.headers = {
        authorization: `Bearer ${token}`
      };
      req.query = {};
      authentication(req, res, done);

      assert(sendAuthenticationFailureStatusSpy.calledWith(401));
      assert(sendAuthenticationFailureJsonSpy.calledWith({
        message: 'Unauthorised'
      }));
      done();
    });


    it('should send unauthorised if query has expired token', (done) => {
      req.headers = {};
      req.query = {
        authorization: `Bearer ${token}`
      };
      authentication(req, res, done);

      assert(sendAuthenticationFailureStatusSpy.calledWith(401));
      assert(sendAuthenticationFailureJsonSpy.calledWith({
        message: 'Unauthorised'
      }));
      done();
    });
  });
  describe('authentication() ', () => {
    let doneCalled;
    let jwtVerifySpy;
    const doneCallback = () => {
      doneCalled = true;
    };

    describe('when success and header has valid jwt', () => {
      before((done) => {
        token = generateJwtToken();
        jwtVerifySpy = sinon.spy(jwt, 'verify');
        req.query = {};
        req.headers['authorization'] = `Bearer ${token}`;
        done();
      });

      after((done) => {
        assert.equal(doneCalled, true);
        jwtVerifySpy.restore();
        done();
      });

      it('should send valid response if header has valid jwt', (done) => {
        authentication(req, res, doneCallback);
        done();
      });

      it('should call jwtVerify with valid args', (done) => {
        authentication(req, res);
        const args = jwtVerifySpy.args[0];
        assert.equal(args[0], token);
        assert.equal(args[1], config.jwtSecret);
        assert.deepEqual(args[2], {
          algorithms: ['HS256'],
          type: 'JWT'
        });
        done();
      });
    });

    describe('when success and query has valid jwt', () => {
      before((done) => {
        req.query['authorization'] = token;
        req.headers = {};
        done();
      });

      after((done) => {
        assert.equal(doneCalled, true);
        done();
      });

      it('should send valid response if header has valid jwt', (done) => {
        authentication(req, res, doneCallback);
        done();
      });
    });
  });
});

function generateJwtToken(hasExpiration) {
  const newToken = !hasExpiration ? jwt.sign({}, config.jwtSecret) : jwt.sign({},
    config.jwtSecret, {
      expiresIn: '0.1'
    });
  return newToken;
}
