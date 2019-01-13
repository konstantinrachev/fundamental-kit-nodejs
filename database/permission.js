var mongoose = require('mongoose');

var PermissionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
});

var Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;