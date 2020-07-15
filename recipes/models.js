'use strict'; 
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// do i need this?
mongoose.Promise = global.Promise;


const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    categories: { type: Array, required: true },
    directions: { type: String, required: true },
    ingredients: [
        {
            ingredient: { type: String, required: true },
            amount: { type: String, required: true },
        }
    ]
})

const Recipe = mongoose.model("Recipe", recipeSchema); // "name", 'schema to use'

module.exports = { Recipe };