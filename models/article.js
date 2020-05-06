const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			minlength: 3,
			maxlength: 12
		},
		description: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 50
		},
		author: {
			type: String,
			required: true
		},
		likes: {
			type: Number,
			default: 0,
		},
		tags: [ String ],
		comments: [ {
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}]
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Article", articleSchema);
