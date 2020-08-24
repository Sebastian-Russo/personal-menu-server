'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const { router: recipeRouter } = require('./recipes');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy, jwtAuth } = require('./auth');

mongoose.Promise = global.Promise; // still needed in mogoose v5?

const { PORT, DATABASE_URL } = require('./config');

const app = express();

// *** MIDDLEWARE ****
app.use(express.json()); // when we call express.json method, method returns piece of middleware, then call app.use, to use that middleware, in the request process pipeline 
app.use(morgan('common'));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// treat like middle ware, use the recipes.js file to handle endpoints that start wtih /api/recipes
// jwtAuth middleware to protected endpoints 
app.use('/api/recipes', jwtAuth, recipeRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


// this prevents jwtAuth below from working 
app.use('/', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });


// mongoose.connect(DATABASE_URL);
// mongoose.connect(
//   "mongodb+srv://SebastianRusso:Requiem12@my-first-atlas-db-csng6.mongodb.net/<dbname>?retryWrites=true&w=majority",
//   () => console.log('connected to database!'));


let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
  
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// for running testing 
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
  
