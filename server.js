const express = require('express');

// const { router: recipeRouter } = required('./recipes');
const recipeRouter = require("./recipes/router");
const usersRouter = require("./users/router");
// const authRouter = require("./auth/router");


const app = express();

// adding piece of middleware
// when we call express.json method, method returns piece of middleware, then call app.use, to use that middleware, in the request process pipeline 
app.use(express.json());

// treat like middle ware, use the recipes.js file to handle endpoints that start wtih /api/recipes
app.use('/api/recipes', recipeRouter);
app.use('/api/users', usersRouter);
// app.user('/api/auth', authRouter);



                // call back function: route handler
app.get('/', (req, res) => {
    res.send('hello world')
});



// an enviorment variable is basically part of the environment in which the process runs 
// it's value is set outside this application 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {app}
