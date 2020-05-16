var express = require("express");
var router = express.Router();
var User = require("../models/user");
var multer = require("multer");
var upload = multer({ dest: "./public/data/uploads/" });
var users = require("../controllers/users");

router.get("/signup", users.signupForm);

router.post("/signup", upload.single("avatar"), users.signup);

router.get("/login", users.loginForm);

router.post("/login", users.login);

router.get("/logout", users.logout);

module.exports = router;
