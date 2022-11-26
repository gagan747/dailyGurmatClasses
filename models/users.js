const mongoose = require('mongoose');

const userschema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is a required field'],
    maxlength: 15,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    default: '',
  }});
const Users = mongoose.model('Users', userschema);
module.exports = Users;
