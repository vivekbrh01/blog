const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: {
			type: Number,
			default: 0,
		},
		tags: [String],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Article", articleSchema);
