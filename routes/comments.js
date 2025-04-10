const express = require("express");
const router = express.Router();

const users = require("../data/users");
const posts = require("../data/posts");
const comments = require("../data/comments");

const error = require("../utilities/error");

router
  .route("/")
  .get((req, res, next) => {
    // Part 8
    // GET /comments?userId=<VALUE>
    // http://127.0.0.1:3000/api/comments?userId=1&api-key=perscholas
    if (req.query.userId) {
      // Check if there are any posts with the userId
      const comment = comments.find((c) => c.userId == req.query.userId);

      if (comment) {
        // Create an array to store the posts
        const commentsArr = [];
        comments.forEach((comment) => {
          if (comment.userId == req.query.userId) {
            commentsArr.push(comment.body);
          }
        });
        res.json(commentsArr);
      } else next();
    } else if (req.query.postId) {
      // Part 9
      // GET /comments?postId=<VALUE>
      // http://127.0.0.1:3000/api/comments?postId=1&api-key=perscholas

      // Check if there are any posts with the userId
      const comment = comments.find((c) => c.postId == req.query.postId);

      if (comment) {
        // Create an array to store the posts
        const commentsArr = [];
        comments.forEach((comment) => {
          if (comment.postId == req.query.postId) {
            commentsArr.push(comment.body);
          }
        });
        res.json(commentsArr);
      } else next();
    }
    // Part 3
    // GET /comments
    // http://127.0.0.1:3000/api/comments?api-key=perscholas
     else res.json(comments);
  })
  .post((req, res) => {
    // POST /comments
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments[comments.length - 1].id + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };

      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    // Part 5
    // GET /comments/:id
    const comment = comments.find((c) => c.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (comment) res.json({ comment, links });
    else next();
  })
  .patch((req, res, next) => {
    // Part 6
    // PATCH /comments/:id
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    // Part 7
    // DELETE /comments/:id

    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  });

module.exports = router;
