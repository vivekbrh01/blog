var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /@/,
		},
		password: {
			type: String,
			minlength: 3,
			required: true,
		},
		avatar: {
			type: String,
			default: "Avatar"
		}
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.password && this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
