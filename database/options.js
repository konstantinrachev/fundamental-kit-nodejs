var mongoose = require('mongoose');

var OptionsSchema = new mongoose.Schema({
    type: String,
    name: String,
    value: Array
});

var Options = mongoose.model('Options', OptionsSchema);

module.exports = Options;