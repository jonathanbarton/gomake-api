import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  imei: String,
  transmitTime: Date,
  latitude: Number,
  longitude: Number,
  altitude: Number,
  satellites: Number,
  fixQuality: Number,
  sensors: Array
});

export default mongoose.model('Telemetry', TelemetrySchema);
