const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const dbName = 'gomakeMock';

module.exports = {
  connect
};

function connect(callback) {
  mockgoose(mongoose).then(() => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`, (err) => {
      callback(err);
    });
  });
}
