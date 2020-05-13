var User = require("../models/user");

exports.checkedUserLogged = (req, res, next) => {
	console.log("In middleware");
	if (req.session && req.session.userId) {
		next();
	} else {
		res.redirect("/users/login");
	}
};

exports.userInfo = (req, res, next) => {
	if (req.session && req.session.userId) {
		User.findById(req.session.userId, "name email", (err, userInfo) => {
			if (err) return next(err);
			req.user = userInfo;
			res.locals.user = userInfo;
			next();
		});
	} else {
		req.user = null;
		res.locals.user = null;
		next();
	}
};
