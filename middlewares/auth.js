var User = require("./routes/users");

exports.checkedUserLogged = (req, res, next) => {
	console.log("In middleware");
	if (req.session && req.session.userId) {
		next();
	} else {
		res.redirect("/users/login");
	}
};

exports.userInfo = (req, res, next) => {
	if (eq.session && req.session.userId) {
		User.findById(req.session.userId, "name, email", (err, user) => {
			console.log(err, user);
			next();
		});
	} else {
		console.log("In user info", "no user");
		next();
	}
};
