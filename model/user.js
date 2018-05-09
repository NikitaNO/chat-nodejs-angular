var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    displayName: { type: String, required: true },
    interest: { type: String },
    id: { type: String },
    status: {type: Number, default: 0},
    avatar: {type: String, default: null},
    socketId: { type: String }
});


module.exports = mongoose.model('User', userSchema);