const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

const parkingSpaceSchema = new mongoose.Schema({
  number: Number,
  status: String,
});

const ParkingSpace = mongoose.model("ParkingSpace", parkingSpaceSchema);

const timeIntervalSchema = new mongoose.Schema({
  number: Number,
  start_time: String,
  end_time: String,
  slot_1: Boolean,
  slot_2: Boolean,
  slot_3: Boolean,
  slot_4: Boolean,
  slot_5: Boolean,
  slot_6: Boolean,
  slot_7: Boolean,
  slot_8: Boolean,
});
const TimeInterval = mongoose.model("TimeInterval", timeIntervalSchema);

module.exports = { User, ParkingSpace, TimeInterval };
