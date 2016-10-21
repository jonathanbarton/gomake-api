import mongoose from 'mongoose';

const flightModelName = 'Flight';

const FlightSchema = new mongoose.Schema({
  callSign: String,
  flightNumber: Number,
  launchStartDateTime: Date,
  launchLocation: String,
  launchAltitude: Number,
  registeredTrackers: Array,
  deviceIds: Array
}, {
  timestamps: true
});

FlightSchema.index({
  callSign: 1,
  flightNumber: 1
}, {
  unique: true
});

FlightSchema.statics = {
  list(limit, skip) {
    return this.find()
      .sort()
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

FlightSchema.statics.getFlightFromFlightName = (flightname) => {
  const flightNameArray = flightname.split('-');
  const callSign = flightNameArray[0];
  const flightNumber = parseInt(flightNameArray[1], 10);
  const flightModel = mongoose.model(flightModelName);
  return flightModel.findOne({ callSign, flightNumber });
};

export default mongoose.model(flightModelName, FlightSchema);
