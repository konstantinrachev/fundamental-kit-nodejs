var mongoose = require('mongoose');

var ContentTypeSchema = new mongoose.Schema({
  title: {
    type: 'String',
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: 'String'
  },
  // template: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'template',
  //   required: false
  // },
  fields: {
    type: [mongoose.Schema.Types.Mixed]
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date,
    required: true
  }
});

var ContentType = mongoose.model('ContentType', ContentTypeSchema);

module.exports = ContentType;