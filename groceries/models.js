'use strict'; 

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const grocerySchema = mongoose.Schema({
    items: { type: Array, required: true },
    userId: { type: String, required: true }
})

grocerySchema.methods.serialize = function() {
    return {
        id: this._id,
        userId: this.userId,
        items: this.items
    };
};

const Grocery = mongoose.model("Grocery", grocerySchema); 

module.exports = { Grocery };
