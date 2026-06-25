
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    artist_name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    date:{ type: String, required:true},
    time:{type: String,required:true},
    isCriticReview: {type:Boolean, required:true}
    isHighlightable: {type:Boolean,required:true}
});

module.exports = mongoose.model('Task', taskSchema);
