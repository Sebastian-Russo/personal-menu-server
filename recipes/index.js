'use strict';
// import Recipes and router from models and router as objects
const {Recipes} = require('./models');
const {router} = require('./router');
//  and then export it as an object, (files aren't objects, but the export is) 
module.exports = {Recipes, router};

// this way when we bring it into server.js, you don't have to specific the file in that folder 
