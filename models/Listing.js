const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: String,
  email: String,
  departureCity: String,
  destination: String,
  flightNum: String,
  date: Date,
  time: String,
  availableSpace: String,
  askingPrice: String,
  additionalInfo: String
});

module.exports = mongoose.model('Listing', ListingSchema);
