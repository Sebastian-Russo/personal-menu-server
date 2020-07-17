'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const recipeRouter = require("./recipes/router");
const usersRouter = require("./users/router");
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

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
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// treat like middle ware, use the recipes.js file to handle endpoints that start wtih /api/recipes
app.use('/api/recipes', recipeRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'hello world'
  });
});


mongoose.connect(DATABASE_URL);
// mongoose.connect(
//   "mongodb+srv://SebastianRusso:Requiem12@my-first-atlas-db-csng6.mongodb.net/<dbname>?retryWrites=true&w=majority",
//   () => console.log('connected to database!'));


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {app}
