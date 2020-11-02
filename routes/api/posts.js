const express = require("express");
const router = express.Router();

const auth = require("./../../middleware/auth");
const postsController = require("./../../controllers/posts");
const { check } = require("express-validator");

// get 'api/posts'
// public
router.get("/", [auth], postsController.getPosts);

// get 'api/posts/:postId'
// public
router.get("/:postId", [auth], postsController.getPostById);

// post 'api/posts'
// private
router.post(
  "/",
  [auth, [check("text").notEmpty().withMessage("text is required")]],
  postsController.addPost
);

// delete 'api/posts/:postId'
// private
router.delete("/:postId", [auth], postsController.deletePost);

// put 'api/posts/:postId/likeOrUnlike'
// private

router.put("/:postId/likeAndUnlike", [auth], postsController.likeAndUnlikePost);

// put 'api/posts/:postId/comment'
// private

router.put(
  "/:postId/comment",
  [auth, [check("text").notEmpty().withMessage("Text is required")]],
  postsController.addComment
);

// delete 'api/posts/:postId/comments/:commentId';
//private

router.delete(
  "/:postId/comments/:commentId",
  [auth],
  postsController.deleteComment
);

module.exports = router;
