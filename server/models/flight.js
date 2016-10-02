import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
  callSign: String,
  flightNumber: Number,
  createdAt: Date,
  launchStartDateTime: Date,
  launchLocation: String,
  launchAltitude: Number,
  registeredTrackers: Array
});

FlightSchema.index({
  callSign: 1,
  flightNumber: 1
}, {
  unique: true
});

FlightSchema.statics = {
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort()
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

export default mongoose.model('Flight', FlightSchema);
