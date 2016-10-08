/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({
	createor: {type: Schema.Types.ObjectId, ref: 'User'},
	content: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Story', StorySchema);