const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("./../models/User");

const addPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    });

    await newPost.save();

    return res.json(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: "Post is not found" }] });
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findOneAndDelete({ _id: postId });

    if (!post) {
      return res.status(400).json({ errors: [{ msg: "Post is not found" }] });
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: "Post is not found" }] });
    }

    const likeIndex = post.likes.map((like) => like.user).indexOf(req.user.id);

    const newLike = {
      user: req.user.id,
    };

    if (likeIndex === -1) {
      post.likes.push(newLike);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: "Post is not found" }] });
    }

    const user = await User.findById(req.user.id);

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    };

    post.comments.push(newComment);

    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ errors: [{ msg: "post is not found" }] });
    }

    const commentIndex = post.comments
      .map((comment) => comment.id)
      .indexOf(commentId);

    if (commentIndex === -1) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Comment is not found" }] });
    }

    const [deletedComment] = post.comments.splice(commentIndex, 1);

    await post.save();

    return res.json(deletedComment);
  } catch (err) {
    console.log();
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

module.exports = {
  addPost,
  getPosts,
  getPostById,
  deletePost,
  likeAndUnlikePost,
  addComment,
  deleteComment,
};
