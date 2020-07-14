'use strict';

const express = require("express");
// const bodyParser = require('body-parser');

const { Recipe } = require('./models');

const router = express.Router();



// VOLATILE STORAGE 
const recipes = [
    {
        id: 0,
        name: "grilled cheese",
        categories: ["lunch"],
        ingredients: [
            {
                ingredient: "bread",
                id: 1,
                amount: "2 slices"
            },
            {
                ingredient: "cheese",
                id: 2,
                amount: "2 slices"
            },
            {
                ingredient: "butter",
                id: 3,
                amount: "1 tbps"
            }
        ],
        directions: "put cheese on bread, then pan fry bread till golden brown and cheese has melted"
    },
    {
        id: 1,
        name: "ramen",
        categories: ["snacks", "lunch", "quick-and-easy"],
        ingredients: [
            {
                ingredient: "roman packet of noodles",
                id: 1,
                amount: "1 packet"
            }
        ],
        directions: "boil water, then wait 3 minutes"
    },
    {
        id: 2,
        name: "cereal",
        categories: ["breakfast", "dessert", "quick-and-easy"],
        ingredients: [
            {
                ingredient: "cereal",
                id: 1,
                amount: "2 cups"
            },
            {
                ingredient: "milk",
                id: 2,
                amount: "1 cup"
            }
        ],
        directions: "pour cereal into bowl, then pour milk into bowl"
    },
    {
        id: 3,
        name: "mac & cheese",
        categories: ["lunch", "dinner", "snacks", "quick-and-easy"],
        ingredients: [
            {
                ingredient: "macaroni",
                id: 1,
                amount: "1 lb"
            },
            {
                ingredient: "cheese",
                id: 2,
                amount: "1 cup"
            }
        ],
        directions: "boil pasta for 10 minutes, then mix in cheese to melt"
}
]





router.get('/', (req, res) => {
    res.json({recipes})
})

router.get('/:id', (req, res) => {
    const recipe = recipes.find(recipe => recipe.id === parseInt(req.params.id));
    if(!recipe) {
        res.status(404).send('The recipe was not found');
        return;
    }
    res.send(recipe)
});

// ISSUE WITH VALIDATOR 
router.post('/', (req, res) => {
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

    const recipe = {
        id: recipes.length + 1,
        name: req.body.name,
        categories: req.body.categories, 
        ingredients: req.body.ingredients,
        directions: req.body.directions
    };

    recipes.push(recipe); // push to array above in volatile storage
    res.send(recipe); 
})

// ISSUE WITH VALIDATOR 
router.put('/:id', (req, res) => {
    const recipe = recipes.find(recipe => recipe.id === parseInt(req.params.id));
    if(!recipe) {
        res.status(404).send('The recipe was not found');
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
    recipe.name = req.body.name;
    recipe.categories = req.body.categories;
    recipe.directions = req.body.directions;
    recipe.ingredients = req.body.ingredients;

    // return the updated course
    res.send(recipe);
})

router.delete('/:id', (req, res) => {
    // look up course
    // if it doesn't exist, return 404
    const recipe = recipes.find(recipe => recipe.id === parseInt(req.params.id));
    if(!recipe) {
        res.status(404).send('The recipe was not found');
        return;
    }

    // delete
    const index = recipes.indexOf(recipe);
    recipes.splice(index, 1)
    // return the same course 
    res.send(recipe);
})


module.exports = router; 

