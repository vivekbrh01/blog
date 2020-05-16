var User = require("../models/user");
var multer = require("multer");
var upload = multer({ dest: "./public/data/uploads/" });

exports.signupForm = function (req, res) {
	res.render("signup");
};
exports.signup = (req, res, next) => {
	console.log(req.file);
	if (req.file) {
		req.body.avatar = req.file.filename;
	}
	User.create(req.body, (err, createdUser) => {
		if (err) return next(err);
		res.redirect("/users/login");
	});
};

exports.loginForm = function (req, res) {
	res.render("loginForm");
};

exports.login = (req, res, next) => {
	var { email, password } = req.body;
	User.findOne({ email }, (err, user) => {
		if (err) return next(err);
		if (!user) {
			console.log("Wrong email");
			// Use flash message
			// res.send(req.flash("message"));
			return res.redirect("/users/login");
		}
		// verify password
		if (!user.verifyPassword(password, this.password)) {
			console.log("wrong password");
			// Use flash message
			return res.redirect("/users/login");
		}
		// log a user in
		req.session.userId = user.id;
		console.log("logged in");
		// res.redirect("../articles");
		res.redirect("/");
	});
};

exports.logout = (req, res) => {
	delete req.session.userId;
	res.clearCookie("connect.sid");
	res.redirect("/");
};
