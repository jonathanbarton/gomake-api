import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('#Flight ', () => {
  describe('# GET /flight/', () => {
    it('should get details of all the flights', () => {
      request(app)
        .get('/flights')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.content).to.be.an('array');
        });
    });
    it('should return the error with 404 status if uri is incorrect', () => {
      request(app)
        .get('/api/flights')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
