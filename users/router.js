'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const { User } = require('./models')

// Volatile storage
const users = [
    {
        id: 0,
        firstName: "Sebastian",
        lastName: "Russo",
        username: "SebRusso",
        password: "Sebastian12"
    },
    {
        id: 1,
        firstName: "Mike",
        lastName: "Ossig",
        username: "Irish",
        password: "gayboy"
    },
    {
        id: 2,
        firstName: "George",
        lastName: "K",
        username: "Goathurder",
        password: "gayboy2"
    }
]

router.get('/', (req, res) => {
    res.json({users})
})

router.get('/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id));
    if(!user) {
        res.status(404).send('The user was not found');
        return;
    }
    res.send(user)
});

// ISSUE WITH VALIDATOR 
router.post('/', (req, res) => {
    const requiredFields = ["password", "lastName", "firstName", "userName"];
    const missingField = requiredFields.find(field => !(field in req.body));
    console.log(missingField)
    if (!missingField) {
        res.status(400).json({
            message: `Required \`${missingField}\` missing.`
        });
        return;
    }
    console.log(req.body);

    const user = {
        id: users.length + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName, 
        username: req.body.username,
        password: req.body.password
    };

    users.push(user); // push to array above in volatile storage
    res.send(user); 
})

// ISSUE WITH VALIDATOR 
router.put('/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id));
    if(!user) {
        res.status(404).send('The user was not found');
    }

    // validate
    // if invalid, return 400 
    const requiredFields = ["name", "categories", "ingredients", "directions"];
    const missingField = requiredFields.find(field => !(field in req.body));
    console.log(missingField)
    if (!missingField) {
        res.status(400).json({
            message: `Required \`${missingField}\` missing.`
        });
        return;
    }
    console.log(req.body);

    // update course 
    user.firstName = req.body.firstName,
    user.lastName = req.body.lastName, 
    user.username = req.body.username,
    user.password = req.body.password

    // return the updated course
    res.send(user);
})

router.delete('/:id', (req, res) => {
    // look up course
    // if it doesn't exist, return 404
    const user = users.find(user => user.id === parseInt(req.params.id));
    if(!user) {
        res.status(404).send('The user was not found');
        return;
    }

    // delete
    const index = users.indexOf(user);
    users.splice(index, 1)
    // return the same course 
    res.send(user);
})


module.exports = router; 

