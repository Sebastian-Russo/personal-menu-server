'use strict'; 
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// do i need this?
mongoose.Promise = global.Promise;

// schema sends back obj made by: Recipe requests, CRUD, from user 
const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    categories: { type: Array, required: true },
    directions: { type: String, required: true },
    ingredients: [
        {
            ingredient: { type: String, required: true },
            amount: { type: String, required: true },
        }
    ],
    userId: { type: String, required: true }
})

// serialize makes a ob like json.Stringify so it's readable for mongo db
recipeSchema.methods.serialize = function() {
    return {
        id: this._id,
        userId: this.userId,
        name: this.name,
        categories: this.categories,
        directions: this.directions,
        ingredients: this.ingredients
    };
};

const Recipe = mongoose.model("Recipe", recipeSchema); // "name", 'schema to use'

module.exports = { Recipe };
