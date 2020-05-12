const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		author: String,
		articleId: {
			type: Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);