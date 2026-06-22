
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    artist_name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
});

module.exports = mongoose.model('Task', taskSchema);
