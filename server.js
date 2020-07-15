const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { router: recipeRouter } = required('./recipes');
const recipeRouter = require("./recipes/router");
const usersRouter = require("./users/router");
// const authRouter = require("./auth/router");

const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise; // still needed in mogoose v5?

const app = express();

// *** MIDDLEWARE ****

app.use(express.json()); // when we call express.json method, method returns piece of middleware, then call app.use, to use that middleware, in the request process pipeline 
app.use(morgan('common'));
app.use(bodyParser.json());
// treat like middle ware, use the recipes.js file to handle endpoints that start wtih /api/recipes
app.use('/api/recipes', recipeRouter);
app.use('/api/users', usersRouter);
// app.user('/api/auth', authRouter);

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });

app.get('/', (req, res) => { // call back function: route handler
    res.send('hello world')
});

mongoose.connect(DATABASE_URL);
// mongoose.connect(
//   "mongodb+srv://SebastianRusso:Requiem12@my-first-atlas-db-csng6.mongodb.net/<dbname>?retryWrites=true&w=majority",
//   () => console.log('connected to database!'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {app}
