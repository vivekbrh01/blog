const express = require("express");
const router = express.Router();
const commentRouter = require("./comments");

//Require Models
const Article = require("../models/article");
const Comment = require("../models/comment");

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
		if (err) return next(err);
		res.render("articles", { articles: listArticles });
	});
});

// Get a single user form database
router.get("/:articleId", (req, res, next) => {
	let articleId = req.params.articleId;
	Article.findById(articleId)
		.populate("comments")
		.exec((err, article) => {
			if (err) return next(err);
			if (!article)
				return res.json({ success: false, message: "Invalid Article ID" });
			res.render("articleDetails", { article });
		});
});

router.post("/:articleId/comments", (req, res) => {
	var articleId = req.params.articleId;
	req.body.articleId = articleId;
	Comment.create(req.body, (err, createdComment) => {
		if (err) return next(err);
		// update article's comment array with nelwy created comment
		Article.findByIdAndUpdate(
			articleId,
			{ $push: { comments: createdComment.id } },
			(err, article) => {
				if (err) {
					return next(err);
				}
				res.redirect(`/articles/${articleId}`);
			}
		);
	});
});
//Comment edit form
router.get("/:articleId/comments/:commentId/edit", (req, res, next) => {
	var commentId = req.params.commentId;
	Comment.findById(commentId, (err, comment) => {
		if (err) return next(err);
		res.render("editCommentForm", { comment });
	});
});

//Delete comment
router.get("/:articleId/comments/:commentId/delete", (req, res, next) => {
	var articleId = req.params.articleId;
	var commentId = req.params.commentId;
	Comment.findByIdAndDelete(commentId, (err, deletedArticle) => {
		if (err) return next(err);
		Article.findByIdAndUpdate(
			articleId,
			{ $pull: { comments: commentId } },
			(err, updatedAticle) => {
				if (err) {
					return next(err);
				}
				res.redirect(`/articles/${articleId}`);
			}
		);
	});
});

//Updated comments
router.post("/:articleId/comments/:commentId", (req, res, next) => {
	var articleId = req.params.articleId;
	var commentId = req.params.commentId;
	console.log(req.body);
	Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
		if (err) return next(err);
		res.redirect(`/articles/${articleId}`);
	});
});

// Display updated data
router.post("/:articleId", (req, res, next) => {
	let id = req.params.articleId;
	Article.findByIdAndUpdate(id, req.body, { new: true }, (err, article) => {
		if (err) return next(err);
		res.render("articleDetails", { article });
	});
});

// Update form
router.get("/:id/edit", (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if (err) return next(err);
		res.render("updateArticleForm", { article });
	});
});

// Likes and Dislikes
router.get("/:articleId/likes", (req, res, next) => {
	var articleId = req.params.articleId;
	Article.findByIdAndUpdate(
		articleId,
		{ $inc: { likes: 1 } },
		(err, article) => {
			if (err) return next(err);
			res.redirect(`/articles/${articleId}`);
		}
	);
});

router.get("/:articleId/dislikes", (req, res, next) => {
	var articleId = req.params.articleId;
	Article.findByIdAndUpdate(
		articleId,
		{ $inc: { likes: -1 } },
		(err, article) => {
			if (err) return next(err);
			res.redirect(`/articles/${articleId}`);
		}
	);
});

//Comment router middleware
// router.use("/", commentRouter);
router.post("/:articleId/comments", (req, res) => {
	console.log(req.body);
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
