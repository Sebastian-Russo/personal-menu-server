'use strict'; 

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

// do i need this?
mongoose.Promise = global.Promise;


const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    recipe: { type: mongoose.SchemaTypes.ObjectId, ref: "Recipe"}
})



module.exports = mongoose.model('User', UserSchema);
