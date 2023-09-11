const express = require('express');
const path = require('path');
const fs = require('fs');
const debug = require('debug')('webapp:server:app');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rfs = require('rotating-file-stream') // version 2.x
const exphbs  = require('express-handlebars');
const dotenv = require('dotenv');
const cors = require('cors');

// load .env configuration
dotenv.config();

// set routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutusRouter = require('./routes/aboutus');
const app = express();

// setup cors
//app.use(cors());// Allow origin for all i.e *

// allow origin for selected URLs
var allowedOrigins = [`http://localhost:${process.env.PORT || '3000'}`,'http://yourapp.com'];

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
}));

// create morgan logger to console
app.use(logger( process.env.MORGAN_LOGGER || 'dev'));

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
});

// setup the logger
app.use(logger('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/aboutus', aboutusRouter);
// handle 404 Error page
app.use((req, res,next) => {
    res.status('404').render('404', { title: 'Page not found!'});
});

module.exports = app;
