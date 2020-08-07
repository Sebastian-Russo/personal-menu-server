'use strict';
const express = require("express");
const { User } = require('./models');
const router = express.Router();

router.post('/', (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
  
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }
  
    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );
  
    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      });
    }
  
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );
  
    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      });
    }
  
    const sizedFields = {
      username: {
        min: 1
      },
      password: {
        min: 10,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
      }
    };
    const tooSmallField = Object.keys(sizedFields).find(
      field =>
        'min' in sizedFields[field] &&
              req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
        'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
    );
  
    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
          : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
        location: tooSmallField || tooLargeField
      });
    }
  
    let {username, password, firstName = '', lastName = ''} = req.body;
    // Username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
  
    return User.find({username})
      .count()
      .then(count => {
        if (count > 0) {
          // There is an existing user with the same username
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Username already taken',
            location: 'username'
          });
        }
        // If there is no existing user, hash the password
        return User.hashPassword(password);
      })
      .then(hash => {
        return User.create({
          username,
          password: hash,
          firstName,
          lastName
        });
      })
      .then(user => {
        return res.status(201).json(user.serialize());
      })
      .catch(err => {
        // Forward validation errors on to the client, otherwise give a 500
        // error because something unexpected has happened
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error'});
      });
});




// update grocery list connected to user id 
router.put('/:id', (req, res) => {
  console.log('grocery list here', req.params, req.body, req.body.id)
  if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
      const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
      console.error(message);
      return res.status(400).json({message: message})
  }

  const toUpdate = {};
  const updateableFields = ["groceryList"];

  updateableFields.forEach(field => {
      if (field in req.body) {
          toUpdate[field] = req.body[field]
      }
  });

  User
      .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
      .then(updateUser => {
          res.status(200).json({
              groceryList: updateUser.groceryList
          })
      })
      .catch(err => res.status(500).json({ message: 'Internal server error'}));
});


// REMOVE DURING PRODUCT, JUST TO CHECK IF CREATING USERS
router.get('/', (req, res) => {
    return User.find()
      .then(users => res.json(users.map(user => user.serialize())))
      .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = {router}; 

