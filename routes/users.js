const express = require("express");
const router = express.Router();

const users = require("../data/users");
const posts = require("../data/posts");
const comments = require("../data/comments");

const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

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

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

  //Part 1 
  // GET /api/users/:id/posts
  // 
router.route("/:id/posts").get((req, res, next) => {
  // Check if the user exists
  const user = users.find((u) => u.id == req.params.id);

  if (user) {
    // Create an array to store the user posts
    const postArr = [];
    //Check if ther are any posts
    posts.forEach((post) => {
      if (post.userId == req.params.id) {
        postArr.push(post);
      } else {
        // If the user has no post
        //res.json(`User has no posts!`);
        next();
      }
    });
    res.json(postArr);
  } else next();
});

router.route("/:id/comments").get((req, res, next) => {
  // Check if the user exists
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    // Part 11
    // GET /users/:id/comments
    // http://127.0.0.1:3000/api/users/1/comments?api-key=perscholas
    if (!req.query.postId) {
      let commentsArr = [];
      comments.forEach((comment) => {
        if (comment.userId == req.params.id) {
          commentsArr.push(comment.body);
        }
      });
      res.json(commentsArr);
    } else if (req.query.postId) {
      // Part 13
      // GET /users/:id/comments?postId=<VALUE>
      // http://127.0.0.1:3000/api/users/1/comments?postId=1&api-key=perscholas
      let commentsArr = [];
      comments.forEach((comment) => {
        if (
          comment.postId == req.query.postId &&
          comment.userId == req.params.id
        ) {
          commentsArr.push(comment.body);
        }
      });
      res.json(commentsArr);
    } else next();
  } else next();
});

module.exports = router;
