'use strict';
const express = require("express");
const { User } = require('./models');
const router = express.Router();

// Volatile storage
// const users = [
//     {
//         id: 0,
//         firstName: "Sebastian",
//         lastName: "Russo",
//         username: "SebRusso",
//         password: "Sebastian12"
//     },
//     {
//         id: 1,
//         firstName: "Mike",
//         lastName: "Ossig",
//         username: "Irish",
//         password: "gayboy"
//     },
//     {
//         id: 2,
//         firstName: "George",
//         lastName: "K",
//         username: "Goathurder",
//         password: "gayboy2"
//     }
// ]
 
router.get('/', (req, res) => {
    User.find()
        .then(users => {
            res.json({users})
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: "Internal server error" })
        });
});

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    User
        .findById(req.params.id)
        .then(user => {
            console.log('retrived user', user)
            res.json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username, 
                password: user.password
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error"});
        });
});

// ISSUE WITH VALIDATOR 
router.post('/', (req, res) => {
//     const requiredFields = ["password", "lastName", "firstName", "userName"];
//     const missingField = requiredFields.find(field => !(field in req.body));
//     console.log(missingField)
//     if (!missingField) {
//         res.status(400).json({
//             message: `Required \`${missingField}\` missing.`
//         });
//         return;
//     }
    console.log(req.body);

    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName, 
        username: req.body.username,
        password: req.body.password
    })
    .then(user => {
        console.log(user)
        return res.status(201).json(user)
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error"});
    });
})

// ISSUE WITH VALIDATOR 
router.put('/:id', (req, res) => {
    console.log(req.params, req.body.id)
    if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
        console.error(message);
        return res.status(400).json({message: message})
    }

    const toUpdate = {};
    const updateableFields = ["name", "categories", "ingredients", "directions"];
    
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field]
        }
    });

    User
        .findByIdAndUpdate(req.params.id, {set: toUpdate})
        .then(updateUser => res.status(200).json({
            id: updateUser.id,
            firstName: updateUser.firstName,
            lastName: updateUser.lastName, 
            username: updateUser.username,
            password: updateUser.password
        }))
        .catch(err => res.status(500).json({ message: "Internal server error"}));
})

router.delete('/:id', (req, res) => {
    User
        .findById(req.params.id)
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error"}));
})


module.exports = router; 

