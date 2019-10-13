const mongoose = require('mongoose');

//describe the properties
const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//name of that it will have, and the schema
module.exports = mongoose.model('Posts', PostSchema);
