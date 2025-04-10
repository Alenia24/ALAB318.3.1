const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res, next) => {
    // Part 2
    // GET /api/posts?userId=<VALUE>
    // http://127.0.0.1:3000/api/posts?userId=2&api-key=perscholas
    if (req.query.userId) {
      // Check if there are any posts with the userId
      const post = posts.find((c) => c.userId == req.query.userId);

      if (post) {
        // Create an array to store the posts
        const postsArr = [];
        posts.forEach((post) => {
          if (post.userId == req.query.userId) {
            postsArr.push(post);
          }
        });
        res.json(postsArr);
      } else next();
    } else {
      const links = [
        {
          href: "posts/:id",
          rel: ":id",
          type: "GET",
        },
      ];

      res.json({ posts, links });
    }
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

// It works but it became challenging to use so i opted to create a comments data
// router
//   .route("/comments")
//   .get((req, res) => {
//     res.json(posts);
//   })
//   .post((req, res, next) => {
//     if (req.body.userId && req.body.postId && req.body.body) {
//       //Check if the post exists
//       const post = posts.find((p) => p.id == req.body.postId);

//       // Create an object to hold the comment
//       if (post) {
//         posts.forEach((post) => {
//           //Check if the postid matches the post
//           if (post.id == req.body.postId) {
//             const comment = {
//               id: post.comments.length + 1,
//               userId: req.body.userId,
//               postId: req.body.postId,
//               body: req.body.body,
//             };
//             post.comments.push(comment);
//           }
//         });
//         res.json(posts);
//       } else next();
//     } else next(error(400, "Insufficient Data"));
//   });

router.route("/:id/comments").get((req, res, next) => {
  //Check if the post exists
  const post = posts.find((p) => p.id == req.params.id);

  // Part 10
  // GET /posts/:id/comments
  // http://127.0.0.1:3000/api/posts/1/comments?api-key=perscholas
  if (!req.query.userId) {
    let commentsArr = [];
    comments.forEach((comment) => {
      if (comment.postId == req.params.id) {
        commentsArr.push(comment.body);
      }
    });
    res.json(commentsArr);
  } else if (req.query.userId) {
    // Part 12
    // GET /posts/:id/comments?userId=<VALUE>
    // http://127.0.0.1:3000/api/posts/1/comments?userId=2&api-key=perscholas
    let commentsArr = [];
    comments.forEach((comment) => {
      if (
        comment.postId == req.params.id &&
        comment.userId == req.query.userId
      ) {
        commentsArr.push(comment.body);
      }
    });
    res.json(commentsArr);
  } else next();
});
module.exports = router;
