var mongoose = require('mongoose');

var FormsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    schema: {
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

var Forms = mongoose.model('Forms', FormsSchema);

module.exports = Forms;