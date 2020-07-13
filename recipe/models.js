'use strict'; 

const mongoose = require('mongoose');
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
