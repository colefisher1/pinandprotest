const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//creating account registration and login schema
const accountSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comments'
  }],
  threads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'threads'
  }],
  pins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pins'
  }]
});

accountSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = {
  Account: mongoose.model("account", accountSchema),
  accountSchema
};
