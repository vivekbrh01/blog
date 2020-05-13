var express = require("express");
var router = express.Router();
var User = require("../models/user");
var multer = require("multer");
var upload = multer({ dest: "./public/data/uploads/" });

/* GET users listing. */
// router.get("/", function (req, res, next) {
// 	if (req.session && req.session.userId) {
// 		return res.send("User Route");
// 	} else {
// 		res.redirect("/user/login");
// 	}
// });

router.get("/signup", function (req, res) {
	res.render("signup");
});

router.post("/signup", upload.single("avatar"), (req, res, next) => {
	console.log(req.file);
	if (req.file) {
		req.body.avatar = req.file.filename;
	}
	User.create(req.body, (err, createdUser) => {
		if (err) return next(err);
		res.redirect("/users/login");
	});
});

router.get("/login", function (req, res) {
	res.render("loginForm");
});

router.post("/login", (req, res, next) => {
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
		// creating a session on the server side
		// session && cookie
		req.session.userId = user.id;
		console.log("logged in");
		// res.redirect("../articles");
		res.redirect("/");
	});
});

router.get("/logout", (req, res) => {
	delete req.session.userId;
	res.clearCookie("connect.sid");
	res.redirect("/");
});
module.exports = router;
