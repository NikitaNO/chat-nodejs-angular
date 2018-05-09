var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var msgSchema = new Schema({
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    message: { type: String, required: true },
    author: {type: Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model('Msg', msgSchema);