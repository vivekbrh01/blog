//Requires
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(session);

//Require router files
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");
// var commentsRouter = require("./routes/comments");

// Connect to database
mongoose.connect(
	"mongodb://localhost/blog",
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		console.log("Connected", err ? err : true);
	}
);

//Instantiate the Express app
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "keyboard cat",
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

app.use(flash());

app.get('/', (req, res) => {
  req.flash('message', 'This is a message from the "/" endpoint');
  res.redirect('/contact');
});

//Routing middlewares
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
// app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

// app.listen(3001, () => {});
module.exports = app;
