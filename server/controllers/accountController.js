const { Account } = require("../models/accountModel");
const { Pin } = require("../models/pinModel");

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

exports.reports = async (req, res) => {
  const token = req.body.usernameToken;

  const decodedToken = jwt.decode(token, jwtKey);

  res.json({username: decodedToken.username});
} 

exports.createProtest = async (req, res) => {
  try {
    const decoded = jwt.decode(req.body.token);
    console.log("req.body.peaceful", req.body.peaceful);
    const pin = new Pin({
      user: decoded._id,
      isViolent: !req.body.peaceful,
      coordinates: {
        lat: req.body.coordinates.lat,
        long: req.body.coordinates.long,
      },
      address: req.body.address
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
