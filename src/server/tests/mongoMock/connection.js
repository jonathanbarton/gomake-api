import mongoMock from 'mongo-mock';
const MongoClient = mongoMock.MongoClient;
const dbName = 'gomake';
MongoClient.persist = 'src/server/tests/mongoMock/data.js';

module.exports = {
  connect
};

function connect(callback) {
  MongoClient.connect(`mongodb://localhost:27017/${dbName}`, (err, db) => {
    callback(err, db, dbName);
  });
}
