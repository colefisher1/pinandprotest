const { Account } = require("../models/accountModel");
const { Pin } = require("../models/pinModel");
const { Comment } = require('../models/commentModel');

const jwt = require("jsonwebtoken");
const jwtKey = require("./jwtKey");

//creating user account
exports.register = async (req, res) => {
  const accountDetails = req.body;
  
  Account.create(accountDetails, (err, data) => {
    if(err)
      res.json({error: "An account with this username already exists"});
    else
      res.json({ success: "Account created successfully!", data});
  });
  
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  const account = await Account.findOne({username: username});

  if(!account || !account.isValidPassword(password))
    res.json({ error: "account does not exist" });
  else
  {
    const tempInfo = account.toObject();
    delete tempInfo.password;
    const token = jwt.sign(tempInfo, jwtKey);
    res.json({ success: "logged in successfully", token});
  }
};  

exports.saveComments = async (req, res) => {
  const token = req.body.usernameToken;
  const post = req.body.post;
  const replyingToID = req.body.replyingToID;

  const decodedToken = jwt.decode(token, jwtKey);



  const comment = new Comment({
    user: decodedToken._id,
    username: decodedToken.username,
    content: post,
    replyingToID,
  })

  const commentID = comment._id;

  Account.findOneAndUpdate({username: decodedToken.username}, {$push: {comments: [commentID]}}, (err, doc, myRes) => {
    if(err) throw err;

    console.log('modified doc', doc);
  });

  if(replyingToID !== null) {
    Comment.findOneAndUpdate({_id: replyingToID}, {$push: { replies: [commentID] }}, (err, doc, response) => {
      if (err) throw err;

      comment.replyingTo = doc ? doc.username : null;

      comment.save();

      res.json({
        username: decodedToken.username,
        user: decodedToken._id,
        commentID,
        replyingToID,
        replyingTo: doc ? doc.username : null,
        date: comment.date
      });
    })
  } else {
    comment.save();

    res.json({
      username: decodedToken.username,
      user: decodedToken._id,
      commentID,
      replyingToID: null,
      replyingTo: null,
      date: comment.date
    });
  }

  
} 

exports.displayComments = async (req, res) => {
  const token = req.body.usernameToken;
  const decodedToken = jwt.decode(token, jwtKey);

  const comments = Comment.find({}, (err, fetchedComments) => {
    if(err) throw err;


    res.send({
      fetchedComments,
      username: decodedToken.username
    });
  });

} 

const recursDelete = (comment, decodedToken) => {
  console.log('comment replies', comment.replies)

  comment.replies.forEach((reply) => {

    Account.findOneAndUpdate({username: decodedToken.username}, {$pull: { comments: reply}}, (error, doc, response) => {
      if(error) throw error;

      Comment.findOneAndDelete({_id: reply}, (err, deletedComment) => {
        if(err) throw err;
        
        if(deletedComment === null) return;
  

        recursDelete(deletedComment, decodedToken);
      });
    });

    
  });
}

exports.deleteComments = async (req, res) => {

  const token = req.body.usernameToken;
  const decodedToken = jwt.decode(token, jwtKey);
  const deleteID = req.body.deleteID;



  Comment.findOne({_id: deleteID}, (err, comment) => {
    if(err) throw err;
    
    if(comment !== null) {
      Account.findOneAndUpdate({username: decodedToken.username}, {$pull: { comments: deleteID}}, (error, doc, response) => {
        if(error) throw error;
      });

      Comment.findOneAndUpdate({_id: comment.replyingToID}, { $pull: { replies: deleteID}}, (error, doc, response) => {
        if(error) throw error;
  
        Comment.findOneAndDelete({_id: comment}, (myError, deletedComment) => {
          if(myError) throw myError;
            
          recursDelete(deletedComment, decodedToken);
        });
  
        
        res.send({ress: "deletion complete"});
      });
    }
  })

}

exports.displayLikes = async (req, res) => {
  const id = req.body.id;
  Comment.findOne({_id: id}, (err, comment) => {
    if(err) throw err;

    if(comment !== null) {
      res.send({
        likesNum: comment.likes.length,
        dislikesNum: comment.dislikes.length
      })
    }
      
  });
}

exports.adjustLikes = async (req, res) => {
  const userID = jwt.decode(req.body.usernameToken, jwtKey)._id;
  const commentUser = req.body.username;
  const id = req.body.id;
  const like = req.body.like;

  Comment.findOne({_id: id}, (err, comment) => {
    if (err) throw err;
    console.log('id',id);
    console.log('couscous', comment);

    let contains = false;
    let likesNum = 0;
    let dislikesNum = 0;

    if(like) {
      
      
      comment.likes.forEach((reference) => {
        console.log('userID',userID);
        console.log('reference',reference);
        if(reference == userID) contains = true;
      });

      console.log(contains);

      if(contains) {
        Comment.findOneAndUpdate({_id: id}, {$pull: {likes: userID}}, (error, doc, resss) => {
          if(error) throw error;

          likesNum = doc.likes.length - 1;
          dislikesNum = doc.dislikes.length;

          contains = false; 

          comment.dislikes.forEach((reference) => {
            if(reference == userID) contains = true;
          });

          if(contains) {
            Comment.findOneAndUpdate({_id: id}, {$pull: {dislikes: userID}}, (error, doc, resss) => {
              if(error) throw error;

              likesNum = doc.likes.length;
              dislikesNum = doc.dislikes.length - 1;

              res.send({
                likesNum,
                dislikesNum
              });
            });
          } else {
            console.log('likesNum', likesNum);
            console.log('dislikesNum', dislikesNum);

            res.send({
              likesNum,
              dislikesNum
            });
          }
        });
      } else {
        Comment.findOneAndUpdate({_id: id}, {$push: {likes: [userID]}}, (error, doc, resss) => {
          if(error) throw error;

          console.log('whatsup doc', doc);

          likesNum = doc.likes.length + 1;
          dislikesNum = doc.dislikes.length;

          contains = false; 

          comment.dislikes.forEach((reference) => {
            if(reference == userID) contains = true;
          });

          if(contains) {
            Comment.findOneAndUpdate({_id: id}, {$pull: {dislikes: userID}}, (error, doc, resss) => {
              if(error) throw error;

              likesNum = doc.likes.length;
              dislikesNum = doc.dislikes.length - 1;

              res.send({
                likesNum,
                dislikesNum
              });
            });
          } else {
            console.log('likesNum', likesNum);
            console.log('dislikesNum', dislikesNum);

            res.send({
              likesNum,
              dislikesNum
            });
          }
        });
      }

      

      // if(!likeClick) {
      //   setLikeClick(true);
      //   setLikes(likes + 1);
    
      //   if(dislikeClick) {
      //       setDislikeClick(false);
      //       setDislikes(dislikes - 1);
      //   }
      // }
      // else {
      //     setLikeClick(false);
      //     setLikes(likes - 1);
      // }

    }
    else {
      comment.dislikes.forEach((reference) => {
        if(reference == userID) contains = true;
      });

      if(contains) {
        Comment.findOneAndUpdate({_id: id}, {$pull: {dislikes: userID}}, (error, doc, resss) => {
          if(error) throw error;

          likesNum = doc.likes.length;
          dislikesNum = doc.dislikes.length - 1;

          contains = false; 

          comment.likes.forEach((reference) => {
            if(reference == userID) contains = true;
          });

          if(contains) {
            Comment.findOneAndUpdate({_id: id}, {$pull: {likes: userID}}, (error, doc, resss) => {
              if(error) throw error;

              likesNum = doc.likes.length - 1;
              dislikesNum = doc.dislikes.length;

              res.send({
                likesNum,
                dislikesNum
              });
            });
          }
          else {
            res.send({
              likesNum,
              dislikesNum
            });
          }
        });
      } else {
        Comment.findOneAndUpdate({_id: id}, {$push: {dislikes: [userID]}}, (error, doc, resss) => {
          if(error) throw error;

          likesNum = doc.likes.length;
          dislikesNum = doc.dislikes.length + 1;

          contains = false; 

          comment.likes.forEach((reference) => {
            if(reference == userID) contains = true;
          });

          if(contains) {
            Comment.findOneAndUpdate({_id: id}, {$pull: {likes: userID}}, (error, doc, resss) => {
              if(error) throw error;

              likesNum = doc.likes.length - 1;
              dislikesNum = doc.dislikes.length;

              res.send({
                likesNum,
                dislikesNum
              });
            });
          }
          else {
            res.send({
              likesNum,
              dislikesNum
            });
          }
        });
      }

      
      // if(!dislikeClick) {
      //   setDislikeClick(true);
      //   setDislikes(dislikes + 1);

      //   if(likeClick) {
      //     setLikeClick(false);
      //     setLikes(likes - 1);
      //   }
      // }
      // else {
      //   setDislikeClick(false);
      //   setDislikes(dislikes - 1);
      // }
    }
  });

}

exports.createProtest = async (req, res) => {
  try {
    const decoded = jwt.decode(req.body.token);
    const pin = new Pin({
      user: decoded._id,
      isViolent: !req.body.peaceful,
      coordinates: {
        lat: req.body.coordinates.lat,
        long: req.body.coordinates.long,
      },
      address: req.body.address,
      protestInfo: req.body.protestInfo
    });

    if (pin._id) {
      pin.save();
      Account.findOneAndUpdate({_id: decoded._id}, { $push: {pins: [pin._id]} }, (err, doc, res)=> {
        console.log(doc);
      })
      res.status(200).send(pin);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    console.log("error createProtest", e);
  }
};

exports.getAllProtests = async (req, res) => {
  try {
    const pins = await Pin.find({});
    res.send(pins);
  } catch (e) {
    console.log("getAllProtests error", e);
  }
};

exports.deleteProtest = async (req, res) => {
  try {
    const decoded = jwt.decode(req.body.token);

    const pin = await Pin.findById(req.params.protestId);

    if (decoded._id === pin.user.toString()) {
      await Pin.findOneAndDelete({ _id: pin._id });
      res.send({ protestId: req.params.protestId });
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    console.log("error delete protest", e);
  }
};

exports.displayAccount = async (req, res) => {
  
  const decodedToken = jwt.decode(req.body.token, jwtKey);

  Account.findOne({_id: decodedToken._id}, (err, user) => {
    if (err) throw err;
    
    const pinPromises = [];
    const commentPromises = [];
    const response = {
      pins: [],
      comments: []
    }

    user.pins.forEach(pin => {
      const promise = Pin.findOne({_id: pin}).exec();
      pinPromises.push(promise);
    });

    user.comments.forEach(comment => {
      const promise = Comment.findOne({_id: comment}).exec();
      commentPromises.push(promise);
    })


    Promise.all(pinPromises)
      .then((pins) => {
        response.pins = pins;
      })
      .then(()=> {
        Promise.all(commentPromises)
        .then((comments) => {
          response.comments = comments;
          res.send(response);
        })

      })

    
  })

}

exports.sendId = async (req, res) => {

  const decodedToken = jwt.decode(req.body.usernameToken, jwtKey);

  res.json({ username: decodedToken.username, _id: decodedToken._id});

}