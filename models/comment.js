var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			//ref is the model that the object id refers to
			ref: "User"
		},
		username: String
	}
});

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;