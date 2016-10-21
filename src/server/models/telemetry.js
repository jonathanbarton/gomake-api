import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  deviceId: String,
  transmitTime: Date,
  latitude: Number,
  longitude: Number,
  altitude: Number,
  satellites: Number,
  fixQuality: Number,
  sensors: Array
}, {
  collection: 'telemetry'
});

export default mongoose.model('Telemetry', TelemetrySchema);
