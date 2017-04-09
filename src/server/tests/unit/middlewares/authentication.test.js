import authentication from '../../../middlewares/authentication';
import jwt from 'jsonwebtoken';
const assert = require('assert');
const sinon = require('sinon');
const config = require('../../../../../src/config/env');
const generateJwtToken = require('../../utils/jwt').generateJwtToken;
let renderAuthernticationFailureSpy;
let renderAuthernticationSuccessSpy;
let token;

const req = {
  headers: {},
  query: {},
  user: {}
};
const doneCallBack = () => {};

const res = {
  authenticationFailure: () => {},
  authenticationSuccess: () => {}
};

describe('Authentication ', () => {
  beforeEach((done) => {
    renderAuthernticationFailureSpy = sinon.spy(res, 'authenticationFailure');
    done();
  });
  afterEach((done) => {
    renderAuthernticationFailureSpy.restore();
    done();
  });
  describe('authentication() : when failure and no token', () => {
    it('should send unauthorised if header or query  does not have token', (done) => {
      authentication(req, res, done);
      assert(renderAuthernticationFailureSpy.calledWith(res, req, 'No token present'));
      done();
    });
  });

  describe('authentication() : when failure and expired token', () => {
    afterEach((done) => {
      assert(renderAuthernticationFailureSpy.calledOnce);
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
      done();
    });
    it('should send unauthorised if query has expired token', (done) => {
      req.headers = {};
      req.query = {
        authorization: `Bearer ${token}`
      };
      authentication(req, res, done);
      done();
    });
  });
  describe('authentication() : when success ', () => {
    let jwtVerifySpy;

    describe('and header has valid jwt', () => {
      before((done) => {
        renderAuthernticationSuccessSpy = sinon.spy(res, 'authenticationSuccess');
        token = generateJwtToken();
        jwtVerifySpy = sinon.spy(jwt, 'verify');
        req.query = {};
        req.headers['authorization'] = `Bearer ${token}`;
        done();
      });

      after((done) => {
        assert(renderAuthernticationSuccessSpy.calledWith(req, doneCallBack));
        renderAuthernticationSuccessSpy.restore();
        jwtVerifySpy.restore();
        done();
      });

      it('should send valid response if header has valid jwt', (done) => {
        authentication(req, res, doneCallBack);
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

      it('should set user in req object', (done) => {
        authentication(req, res, done);
        assert.equal(req.user.name, 'Neha');
        done();
      });
    });

    describe('and query has valid jwt', () => {
      before((done) => {
        renderAuthernticationSuccessSpy = sinon.spy(res, 'authenticationSuccess');
        req.query['authorization'] = token;
        req.headers = {};
        done();
      });

      after((done) => {
        assert(renderAuthernticationSuccessSpy.calledWith(req, doneCallBack));
        renderAuthernticationSuccessSpy.restore();
        done();
      });

      it('should send valid response if query has valid jwt', (done) => {
        authentication(req, res, doneCallBack);
        done();
      });
    });
  });
});
