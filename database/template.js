var mongoose = require('mongoose');

var TemplateSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true,
        unique: true
    },
    content: {
        type: 'String',
        required: true
    },
    path: {
        type: 'String'
    },
    dependencies: {
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

var Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;