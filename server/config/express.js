const path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    accountRoute = require('../routes/accountRoute'),
    cors = require("cors");

module.exports.init = () => {
    /* 
        connect to database
        - reference README for db uri
    */
    mongoose.connect(process.env.DB_URI || require('./config').db.uri, {
        useNewUrlParser: true,
    }).then((success) => console.log("Database connected successfully"))
    .catch((error) => console.log("error connecting to database", error));
    
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    //mongoose.set('useUnifiedTopology', true);

    // initialize app
    const app = express();

    // enable request logging for development debugging
    app.use(morgan('dev'));

    app.use(cors());

    // body parsing middleware
    app.use(bodyParser.json());

    // add a router
    app.use('/api', accountRoute);

    if (process.env.NODE_ENV === 'production') {
        // Serve any static files
        app.use(express.static(path.join(__dirname, '../../client/build')));

        // Handle React routing, return all requests to React app
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });
    }

    return app
}