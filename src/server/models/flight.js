import GeoJSON from 'mongoose-geojson-schema'; //eslint-disable-line
import mongoose from 'mongoose';
const flightModelName = 'Flight';

const FlightSchema = new mongoose.Schema({
  callSign: String,
  flightNumber: Number,
  launchStartDateTime: Date,
  launchLocation: mongoose.Schema.Types.GeoJSON,
  launchAltitude: Number,
  registeredTrackers: Array,
  deviceIds: Array,
  userIds: Array
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
  list(userId) {
    return this.find({ userIds: userId })
      .sort()
      .exec();
  }
};

FlightSchema.statics.getFlightFromFlightName = (flightname) => {
  if (!isValidFlightName(flightname)) {
    return null;
  }
  const flightNameArray = flightname.split('-');
  const callSign = flightNameArray[0];
  const flightNumber = parseInt(flightNameArray[1], 10);
  const flightModel = mongoose.model(flightModelName);
  return flightModel.findOne({ callSign, flightNumber });
};

function isValidFlightName(flightname) {
  return /^.*\-[1-9][0-9]{0,2}$/.test(flightname);
}

export default mongoose.model(flightModelName, FlightSchema);
