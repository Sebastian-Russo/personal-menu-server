const express = require('express');
const app = express();

// adding piece of middleware
// when we call express.json method, method returns piece of middleware, then call app.use, to use that middleware, in the request process pipeline 
app.use(express.json());

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

                // call back function: route handler
app.get('/', (req, res) => {
    res.send('hello world')
});

app.get('/api/recipes', (req, res) => {
    res.json({recipes})
})

app.get('/api/recipes/:id', (req, res) => {
    const recipe = recipes.find(recipe => recipe.id === parseInt(req.params.id));
    if(!recipe) res.status(404).send('The recipe was not found');
    res.send(recipe)
});

app.post('/api/recipes', (req, res) => {

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





// an enviorment variable is basically part of the environment in which the process runs 
// it's value is set outside this application 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {app}
