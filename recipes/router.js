'use strict';

const express = require("express");

const { Recipe } = require('./models'); // recipe schema 

const router = express.Router();



router.get('/', (req, res) => {
    Recipe.find()
        .then(recipes => {
            res.json(recipes)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: err.message });
        });
});

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    Recipe
        .find({'userId':req.params.id}) // find all recipes where user id is gunna be the id from the request... use the user id to find all the recipes that have the same user id
        .then(recipes => {
            console.log('retrived recipes', recipes) 
            const response = recipes.map(recipe => { // grabbed all the recipes, seralize each one, and back as an array of recipes/objs to user
                return recipe.serialize();
            })
            res.json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: err.message });
        });
});


router.post('/', (req, res) => {
    // const requiredFields = ["name", "categories", "ingredients", "directions"];
    // const missingField = requiredFields.find(field => !(field in req.body));
    // console.log(missingField)
    // if (!missingField) {
    //     res.status(400).json({
    //         message: `Required \`${missingField}\` missing.`
    //     });
    //     return;
    // } 

    console.log(req.body)
    Recipe.create({
        name: req.body.name,
        categories: req.body.categories, 
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        userId: req.body.userId // need to add userId when creating new recipe, so this recipe is linked to the user id with all the user's other recipes 
    })
    .then(recipe => {
        console.log(recipe)
        return res.status(201).json(recipe)
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: err.message });
    });
});


router.put('/:id', (req, res) => {
    console.log('here', req.params, req.body)
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

    console.log('UPDATING', toUpdate);

    Recipe
        .findOneAndUpdate({_id: req.params.id}, 
            {$set: toUpdate}, 
            {new: true}
        )
        .then(updateRecipe => {
            console.log('UPDATE RECIPE', updateRecipe)
            
            return res.status(204).json({
                id: updateRecipe._id, // connects recipe to user 
                name: updateRecipe.name,
                categories: updateRecipe.categories, 
                ingredients: updateRecipe.ingredients,
                directions: updateRecipe.directions
            })
        })
        .catch(err => res.status(500).json({ message: err.message }));
});


router.delete('/:id', (req, res) => {
    Recipe
        .findByIdAndRemove(req.params.id)
        .then(recipe => res.status(204).end())
        .catch(err => res.status(500).json({ message: err.message }));
});


module.exports = {router}; 

