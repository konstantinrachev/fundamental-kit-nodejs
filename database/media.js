var mongoose = require('mongoose');

var MediaSchema = new mongoose.Schema({
    name: String,
    path: {
        type: String,
        required: true
    },
    original: String,
    size: Number,
    mimetype: String,
    created: {
        type: Date,
        required: true
    },
    updated: {
        type: Date,
        required: true
    }
});

var Media = mongoose.model('Media', MediaSchema);

module.exports = Media;