var mongoose = require('mongoose');

var Pages = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
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

var Pages = mongoose.model('Pages', Pages);

module.exports = Pages;