const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  //May switch to avatars later
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  replyingToID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    default: null
  },
  replyingTo: {
    type: String,
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments'
  }],
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account'
  }],
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = {
    Comment: mongoose.model("comments", commentSchema),
    commentSchema
};
