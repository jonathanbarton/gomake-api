import assert from 'assert';
const rewire = require('rewire');
require('sinon-as-promised');
const APIError = rewire('../../helpers/APIError');

describe('APIError', () => {
  it('should have a message and status', (done) => {
    const apiError = new APIError('test', 'test_status', true);
    assert.equal(apiError.message, 'test');
    assert.equal(apiError.status, 'test_status');
    done();
  });
});
