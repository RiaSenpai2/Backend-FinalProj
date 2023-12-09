const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  userType: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
