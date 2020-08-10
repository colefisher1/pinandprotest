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
    replyingToID
  })

  const commentID = comment._id;

  

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

const recursDelete = (comment) => {
  console.log('comment replies', comment.replies)

  comment.replies.forEach((reply) => {
    Comment.findOneAndDelete({_id: reply}, (err, deletedComment) => {
      if(err) throw err;
      
      if(deletedComment === null) return;

      recursDelete(deletedComment);
    });
  });
}

exports.deleteComments = async (req, res) => {
//   props.posts.map(post => {
//     if(post.id === props.postId){
//         props.posts.forEach(parent => {
//             if (parent.id === post.replyingTo) {
//                 parent.replies.forEach((reply, i) => {
//                     if(reply.id === post.id)
//                         parent.replies.splice(i, 1);
//                 })
//             }
//         })
//         deletePost(props.posts[props.posts.indexOf(post)]);
//     }
// })
  const token = req.body.usernameToken;
  const decodedToken = jwt.decode(token, jwtKey);
  const deleteID = req.body.deleteID;



  Comment.findOne({_id: deleteID}, (err, comment) => {
    if(err) throw err;
    
    if(comment !== null) {
      Comment.findOneAndUpdate({_id: comment.replyingToID}, { $pull: { replies: deleteID}}, (err, doc, response) => {
        if(err) throw err;
  
        Comment.findOneAndDelete({_id: comment}, (err, deletedComment) => {
          if(err) throw err;
            
          recursDelete(deletedComment);
        });
  
        
        res.send({ress: "deletion complete"});
      });
    }
  })

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

    user.pins.forEach(pin => {
      const promise = Pin.findOne({_id: pin}).exec();
      pinPromises.push(promise);
    });

    Promise.all(pinPromises)
      .then((pins) => res.send(pins));
  })

}

exports.sendId = async (req, res) => {

  const decodedToken = jwt.decode(req.body.usernameToken, jwtKey);

  res.json({ username: decodedToken.username, _id: decodedToken._id});

}