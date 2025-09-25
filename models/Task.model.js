const mongoose = require('mongoose');

const tasksSchema = mongoose.Schema({
    taskname : {
        type: String,
        required: true,
    },
    completed : {
        type: Boolean,
        required: true,
    },
    important : {
        type: Boolean,
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { collection: 'tasks' });

const Task = mongoose.model('Task', tasksSchema);

module.exports = Task;