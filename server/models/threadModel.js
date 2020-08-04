  const mongoose = require("mongoose");

const threadSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  // content may be used if the user can write something before creating a thread.
  content: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments'
  }],
  pin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pins'
  }, //used to get the address of the protest on the thread
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = {
    Thread: mongoose.model("threads", threadSchema),
    threadSchema
};
