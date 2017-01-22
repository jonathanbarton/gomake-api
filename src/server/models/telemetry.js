import GeoJSON from 'mongoose-geojson-schema'; //eslint-disable-line
import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  deviceId: String,
  transmitTime: Date,
  location: mongoose.Schema.Types.Point,
  altitude: Number,
  satellites: Number,
  fixQuality: Number,
  sensors: Object
}, {
  collection: 'telemetry'
});

export default mongoose.model('Telemetry', TelemetrySchema);
