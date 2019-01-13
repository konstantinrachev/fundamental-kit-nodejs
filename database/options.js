var mongoose = require('mongoose');

var OptionsSchema = new mongoose.Schema({
    type: String,
    name: String,
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

var Options = mongoose.model('Options', OptionsSchema);

module.exports = Options;