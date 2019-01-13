var mongoose = require('mongoose');

var NotificationsSchema = new mongoose.Schema({
    channel: {
        type: String,
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

var Notifications = mongoose.model('Notifications', NotificationsSchema);

module.exports = Notifications;