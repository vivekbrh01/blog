const Article = require("../models/article");
const Comment = require("../models/comment");

exports.listArticles = (req, res, next) => {
	console.log(req.flash("Warning"));
	Article.find()
		.populate("auhtor")
		.exec((err, articles) => {
			if (err) return next(err);
			console.log(articles);

			res.render("articles", { articles });
		});
};

exports.articleFrom = (req, res) => {
	res.render("articleForm");
};

exports.createNewArticle = (req, res, next) => {
	//grab body data
	req.body.author = req.user.id;
	req.body.tags = req.body.tags.split(" , ");
	// console.log(req.body);
	//save the data to the database
	Article.create(req.body, (err, createdArticle) => {
		if (err) return next(err);
		//sending response to the client
		res.redirect("/articles");
	});
}