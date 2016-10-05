import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('#Telemetry ', () => {
  describe('# GET /flight/:flightname', () => {
    it('should only accept a valid flightname in the URL', () => {
      request(app)
        .get('/flight/gomake-1/telemetry')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.content).to.be.an('array');
        });
    });
  });
});
