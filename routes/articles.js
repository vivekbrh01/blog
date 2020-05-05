const express = require("express");
const router = express.Router();

//Require Models
const Article = require("../models/article");

//Routes

// Add form
router.get("/new", (req, res) => {
	res.render("articleForm");
});

// Create article
router.post("/new", (req, res, next) => {
	//grab body data
	req.body.tags = req.body.tags.split(",");
	console.log(req.body);
	//save the data to the database
	Article.create(req.body, (err, data) => {
		if (err) return next(err);
		//sending response to the client
		res.redirect("/articles");
	});
});

// List all articles form database
router.get("/", (req, res, next) => {
	Article.find({}, (err, listArticles) => {
		console.log(listArticles);

		if (err) return next(err);
		res.render("articles", { articles: listArticles });
	});
});

// Get a single user form database
router.get("/:userId", (req, res, next) => {
	let id = req.params.userId;
	Article.findById(id, (err, article) => {
		if (err) return next(err);
		res.render("articleDetails", { article });
	});
});

// Display updated data
router.post("/:userId", (req, res, next) => {
	let id = req.params.userId;
	Article.findByIdAndUpdate(id, req.body, { new: true }, (err, article) => {
		if (err) return next(err);
		res.render("articleDetails", { article });
	});
});

// Update form
router.get("/:id/edit", (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		console.log(err, article);
		if (err) return next(err);
		res.render("updateArticleForm", { article });
	});
});

// Delete a user
router.delete("/:id", (req, res) => {
	Article.findByIdAndDelete(req.params.id, (err, articleDeleted) => {
		if (err) return next(err);

		res.send(articleDeleted.title + "Deleted");
	});
});

router.get("/:id/delete", (req, res) => {
	Article.findByIdAndRemove(req.params.id, (err, article) => {
		res.redirect("/articles/");
	});
});

module.exports = router;
