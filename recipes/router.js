'use strict';

const express = require("express");

const { Recipe } = require('./models'); // recipe schema 

const router = express.Router();



// // VOLATILE STORAGE 
// const recipes = [
//     {
//         id: 0,
//         name: "grilled cheese",
//         categories: ["lunch"],
//         directions: "put cheese on bread, then pan fry bread till golden brown and cheese has melted",
//         ingredients: [
//             {
//                 ingredient: "bread",
//                 id: 1,
//                 amount: "2 slices"
//             },
//             {
//                 ingredient: "cheese",
//                 id: 2,
//                 amount: "2 slices"
//             },
//             {
//                 ingredient: "butter",
//                 id: 3,
//                 amount: "1 tbps"
//             }
//         ]
//     },
//     {
//         id: 1,
//         name: "ramen",
//         categories: ["snacks", "lunch", "quick-and-easy"],
//         ingredients: [
//             {
//                 ingredient: "roman packet of noodles",
//                 id: 1,
//                 amount: "1 packet"
//             }
//         ],
//         directions: "boil water, then wait 3 minutes"
//     },
//     {
//         id: 2,
//         name: "cereal",
//         categories: ["breakfast", "dessert", "quick-and-easy"],
//         directions: "pour cereal into bowl, then pour milk into bowl",
//         ingredients: [
//             {
//                 ingredient: "cereal",
//                 id: 1,
//                 amount: "2 cups"
//             },
//             {
//                 ingredient: "milk",
//                 id: 2,
//                 amount: "1 cup"
//             }
//         ]
//     },
//     {
//         id: 3,
//         name: "mac & cheese",
//         categories: ["lunch", "dinner", "snacks", "quick-and-easy"],
//         directions: "boil pasta for 10 minutes, then mix in cheese to melt",
//         ingredients: [
//             {
//                 ingredient: "macaroni",
//                 id: 1,
//                 amount: "1 lb"
//             },
//             {
//                 ingredient: "cheese",
//                 id: 2,
//                 amount: "1 cup"
//             }
//         ]
//     }
// ]





router.get('/', (req, res) => {
    Recipe.find()
        .then(recipes => {
            res.json({recipes})
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ message: "Internal server error"});
        });
});

router.get('/:id', (req, res) => {
    Recipe
        .findById(req.params.id)
        .then(recipe => {
            console.log('retrived recipe', recipe)
            res.json({
                name: req.body.name,
                categories: req.body.categories, 
                ingredients: req.body.ingredients,
                directions: req.body.directions
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
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
        directions: req.body.directions
    })
    .then(recipe => {
        console.log(recipe)
        return res.status(201).json(recipe)
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    });
})



// ISSUE WITH VALIDATOR 
router.put('/:id', (req, res) => {
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

    Recipe
    .findByIdAndUpdate(req.params.id)
    .then(updateRecipe => res.status(200).json({
            id: updateRecipe.id,
            name: updateRecipe.name,
            categories: updateRecipe.categories, 
            ingredients: updateRecipe.ingredients,
            directions: updateRecipe.directions
        }))
        .catch(err => res.status(500).json({ message: 'Internal server error'}));
})



router.delete('/:id', (req, res) => {
    Recipe.findByIdAndRemove(req.params.id)
    .then(recipe => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
})


module.exports = router; 

