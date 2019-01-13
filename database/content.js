var mongoose = require('mongoose');

var ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String,
  slug: {
  	type: 'String',
  	required: true,
  	unique: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  fields: {
  	type: [mongoose.Schema.Types.Mixed]
  },
  meta: {
    type: [mongoose.Schema.Types.Mixed]
  },
  options: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId
  },
  active: {
    type: Boolean,
    required: true
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

var ContentSchema = mongoose.model('Content', ContentSchema);

module.exports = ContentSchema;