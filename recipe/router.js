// 'use strict';
// const express = require('express');
// const bodyParser = require('body-parser');

// const router = express.Router();
// const jsonParser = bodyParser.json();
// const { Recipe } = require('./models');


// // CRUD //////

// router.get('/recipe', (req, res) => {
//     res.json(Recipe.get());
// });

// router.get("/", (req, res) => {
//     Recipe.find()
//         .then(recipe => {
//             res.json({
//             recipe: recipe.map(recipe => recipe.serialize())
//           })
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ message: "Internal server error" });
//         });
// });

// router.get("/:id", (req, res) => {
//     Recipe
//       .findById(req.params.id) // `req.params.id` is the path URL id for a specific id
//       .then(recipe => {
//         console.log('retrieved recipe', recipe);
//         res.json({

//       });
//     })
//       .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//       });
// });

// router.post("/", jsonParser, (req, res) => {
//     const requiredFields = [];
//     const missingField = requiredFields.find(field => !(field in req.body));
//     if (missingField) {
//         return res.status(400).json({
//             message: `Required \`${field}\` missing.`
//         });
//     }
//     console.log(req.body)
//     Recipe.create({
//     // add recipe res object here 
//     })
//     .then(recipe => {
//     console.log(recipe)
//     return res.status(201).json(recipe.serialize())
//    })
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     });
// });

// router.put('/:id', jsonParser, (req, res) => {
//     if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
//         const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
//         console.error(message);
//         return res.status(400).json({message: message})
//     }

//     const toUpdate = {};
//     const updateableFields = [];
    
//     updateableFields.forEach(field => {
//         if (field in req.body) {
//             toUpdate[field] = req.body[field];
//         }
//     });

//     Recipe
//         .findByIdAndUpdate(req.params.id, {$set: toUpdate})
//         .then(updateRecipe => res.status(200).json({
//         // add recipe res object here 
//         }))
//         .catch(err => res.status(500).json({message: 'Internal server error'}));
// })

// router.delete("/:id", jwtAuth, (req, res) => {
//     Recipe.findByIdAndRemove(req.params.id)
//       .then(recipe => res.status(204).end())
//       .catch(err => res.status(500).json({ message: "Internal server error" }));
//   });

// module.exports = {router};