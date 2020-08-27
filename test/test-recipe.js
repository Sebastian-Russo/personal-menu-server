// 'use strict';
// require('dotenv').config(); //
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
// const { TEST_DATABASE_URL } = require("../config");

// // import server.js and use destructuring assignment to create variables for app, runServer, closeServer
// const { app, runServer, closeServer } = require("../server"); 
// const { Recipe } = require('../recipes/models');
// const { User } = require('../users');
// // const Recipe = require('../recipes');

// const expect = chai.expect; // declare a variable for expect from chai import 
// const should = chai.should; 

// chai.use(chaiHttp); // chai.request()


// describe('/api/recipes', function() {

//     let authToken;
//     let userId;
//     let recipeId;

//     // generate an object representing a recipe for db and req.body
//     const recipeData = {
//         name: faker.lorem.word(),
//         categories: [ faker.lorem.word(), faker.lorem.word(), faker.lorem.word() ],
//         ingredients: [{
//             ingredient: faker.lorem.word(),
//             amount: faker.lorem.word()
//         }],
//         directions: faker.lorem.words()
//     }

//     // need to create mock user because of protected endpoint 
//     function createMockUser() {
//         console.info('creating mock user');
//         return chai.request(app)
//             .post('/api/users/')
//             .send({
//                 username: 'username', 
//                 password: 'password12',
//                 firstName: 'firstName',
//                 lastName: 'lastName',
//                 groceryList: [],
//                 categoryList: []
//             })
//             .then(() => logUserIn())
//             .catch(err => console.log(err))
//     }

//     function seedRecipeData(userId) { 
//         console.info('seeding recipe data');
//         recipeData.userId = userId; 
//             return chai.request(app)
//                 .post(`/api/recipes/`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .send(recipeData)
//                 .then(res => {
//                     recipeId = res.body._id
//                     console.log('RECIPE DATA', recipeData, res.body, 'recipeId is', recipeId)
//                 })
//                 .catch(err => console.log(err))
//     }

//     function logUserIn() {
//         console.info('loggin in')
//         return chai.request(app) // returns a promise, chai.request makes http request to server (app), like app.express uses 'app' too 
//             .post('/api/auth/login')  // chained post method, path 
//             .send({username: 'username', password: 'password12'}) // payload/ req.body 
//             .then(res => {  // res.body 
//                 authToken = res.body.authToken, // set global variable to use throughout testing
//                 userId = res.body.userObj.id,  // set global variable to use throughout testing
//                 seedRecipeData(userId)  // call seedRecipeData with userId, just as if a user logged in, and added a recipe, connected to their id 
//             })
//             .catch(err => console.log(err))  
//     }

//     // deletees the entire database, call it in 'afterEach'
//     function tearDownDb() {
//         console.warn('Deleting database');
//         return mongoose.connection.dropDatabase()
//     }


//     /*** TEST SET UP ***/

//     // before our test runs, activate the server, use separate test DB
//     before(() => {
//         return runServer(TEST_DATABASE_URL); // returns promise 
//     })

//     // zeroes out the db after each test has run 
//     afterEach(() => {
//         return tearDownDb();
//     })

//     // close server after these tests run, incase other modules need to call runServer (like users)
//     after(() => {
//         return closeServer();
//     })


//     /*** TEST ENDPOINTS  ***/

//     describe('GET endpoint', () => {

//         // seeds db with test data
//         beforeEach(() => {
//             return createMockUser();
//         })

//         it('Should reject unauthorized requests', () => {
//             return chai.request(app)    // http request, returned as a promise
//                 .get(`/api/recipes/${userId}`) // chained GET method, path with userId (global var)
//                 .set('Authorization', 'Bearer IamAuthorized') // set header, key/value pair (value purposely incorrect here)
//                 .then((res) => {
//                     console.log('RESPONSE BODY', res.body)
//                     // expect.fail(null, null, "Request should not succeed")
//                 })          
//                 .catch(err => {
//                     console.log('initial error', err)
//                     if (err instanceof chai.AssertionError) { // ??? Asserts that the target is an instance of the given constructor
//                         throw err;
//                     }
//                     const res = err.response;  // set res to response error 
//                     console.log('error res is', res)
//                     expect(res).to.have.status(401); // assertion, expect specific status 
//                     expect(res.test).to.equal('Unauthorized') // assserts that target is strictly (===) equal to val 
//                 });
//         })

//         // grab all recipes for user 
//         it('Should return all the recipes for a specific user', () => {
//             let _res;
//             console.log('USER CREDNTIALS', authToken, userId)
//             return chai.request(app)  // return promise, chai http request method 
//                 .get(`/api/recipes/${userId}`) // chained GET method, path with userId (global var)
//                 .set('Authorization', `Bearer ${authToken}`) // set head, key/value pair 
//                 .then(res => {
//                     _res = res;
//                     expect(res).to.have.status(200);
//                     expect(res.body).to.be.a('array');
//                     expect(res).to.be.json;
//                     const expectedKeys = ['userId', 'id', 'name', 'categories', 'ingredients', 'directions'];
//                     expect(res.body[0]).to.have.keys(expectedKeys)
//                     const resRecipe = res.body[0]; // grab first recipe in array of recipes from req.body 
//                     return Recipe.findById(resRecipe.id).exec() // exce() tests for match in a string 
//                 })
//                 .then(recipe => {
//                     const resRecipe = _res.body[0]; // grab first recipe in array of recipes from req.body 
//                     expect(resRecipe.userId).to.deep.equal(`${userId}`) // deep equal (==) instead of strict (===), deep equal cares about the contents of the object, rather than referential equality
//                     expect(resRecipe.id).to.deep.equal(recipe.id);
//                     expect(resRecipe.name).to.deep.equal(recipe.name);
//                     expect(resRecipe.directions).to.deep.equal(recipe.directions);
//                     expect(resRecipe.categories).to.be.a('array');
//                     expect(resRecipe.ingredients).to.be.a('array');
//                     // do categories/ingredients need more assersions?
//                 })
//         });
//     })



//     describe('POST endpoint', () => {
        
//         beforeEach(() => {
//             return createMockUser();
//         })

//         it('Should reject recipes with missing fields', () => {
//             return chai.request(app)
//             .post(`/api/recipes/${userId}`)
//             .set('Authorization', `Bearer ${authToken}`)
//             .send({name: 'name', directions: 'directions'})
//             .then((res) => {
//                 console.log('RESPONSE BODY', res.body)
//                 // expect.fail(null, null, "Request should not succeed")
//             })
//             .catch(err => {
//                 if (err instanceof chai.AssertionError) {
//                     throw err;
//                 }
//                 const res = err.response;
//                 expect(res).to.have.status(500);
//             })
//         })

//         it('Should create new recipe, linked to user', () => {
//             let _res;
//             Recipe.create(recipeData)
//               .then(recipe => {
//                 console.log('POST created new recipe', recipe)
//                 return chai.request(app)
//                 .post('/api/recipes/') // userId for new recipe
//                 .set('Authorization', `Bearer ${authToken}`) // set head, key/value pair 
//                 .send(recipe) // send payload 
//                 .then(res => { // test assertions for payload
//                     _res = res; // payload 
//                     expect(res).to.have.status(201);
//                     expect(res).to.be.a('object');
//                     expect(res).to.be.json;
//                     const expectedKeys = ['userId', 'id', 'name', 'categories', 'ingredients', 'directions'];
//                     expect(res.body).to.have.keys(expectedKeys);
//                     const resRecipe = res.body;
//                     return Recipe.findById(resRecipe.id).exec()
//                 })
//                 .then(recipe => { // test assertions for res.body
//                     const resRecipe = _res.body; // set resRecipe as payload/_res.body
//                     expect(resRecipe.userId).to.deep.equal(`${userId}`) // deep equal (==) instead of strict (===), deep equal cares about the contents of the object, rather than referential equality
//                     expect(resRecipe.id).to.deep.equal(recipe.id);
//                     expect(resRecipe.name).to.deep.equal(recipe.name);
//                     expect(resRecipe.directions).to.deep.equal(recipe.directions);
//                     expect(resRecipe.categories).to.be.a('array');
//                     expect(resRecipe.ingredients).to.be.a('array');
//                 })
//               })
//         })
//     })


//     describe('PUT endpoint', () => {

//         beforeEach(() => {
//             return createMockUser();
//         })

//         it('Should reject unauthorized requests', () => {
//             return chai.request(app)
//                 .put(`/api/recipes/${userId}`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .then((res) => {
//                     console.log('RESPONSE BODY', res.body)
//                     // expect.fail(null, null, "Request should not succeed")
//                 })
//                 .catch(err => {
//                     if (err instanceof chai.AssertionError) {
//                         throw err;
//                     }
//                     const res = err.response;
//                     expect(res).to.have.status(401);
//                     expect(res.text).to.equal('Unauthorized')
//                 })
//         })

//         it('Should update the correct recipe by id', () => {
//             const updatedRecipe = {
//                 'id': userId,
//                 'name': 'New Name',
//                 'directions': 'New directions',
//                 'categories': ['new cat', 'new cat', 'new cat'],
//                 'ingredients': [ {
//                     'ingredient': 'new ingredient',
//                     'amount': 'new amount'
//                 }]
//             }
//             console.log(recipeId, userId)
//             return chai.request(app)
//                 .put(`/api/recipes/${userId}`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .send(updatedRecipe)
//                 .then(res => { // test payload
//                     console.log('UPDATE RES.BODY', res.body)
//                     expect(res).to.have.status(204);
//                     return Recipe.findById(recipeId);
//                 })
//                 .then(recipe => {
//                     expect(recipe.name).to.deep.equal('New Name');
//                     expect(recipe.directions).to.deep.equal('New directions');
//                     expect(recipe.categories).to.deep.equal(['new cat', 'new cat', 'new cat']);
//                     expect(recipe.ingredients).to.deep.equal([ {
//                         'ingredient': 'new ingredient',
//                         'amount': 'new amount'
//                     }])
//                 })
//         })
//     })


//     describe('DELETE endpoint', () => {

//         beforeEach(() => {
//             return createMockUser();
//         })

//         it('Should reject unauthorized requests', () => {
//             return chai.request(app)
//                 .delete(`/api/recipes/${recipeId}`)
//                 .then((res) => {
//                     console.log('RESPONSE BODY', res.body)
//                     // expect.fail(null, null, "Request should not succeed")
//                 })
//                 .catch(err => {
//                     if (err instanceof chai.AssertionError) {
//                         throw err;
//                     }
//                     const res = err.response;
//                     expect(res).to.have.status(401);
//                     expect(res.text).to.equal('Unauthorized')
//                 })
//         })

//         it('Should delete the correct recipe by id', () => {
//             console.log(recipeId)
//             return chai.request(app)
//                 .delete(`/api/recipes/${recipeId}`)
//                 .set('Authorization', `Bearer ${authToken}`)
//                 .then(res => {
//                     console.log(res.body)
//                     expect(res).to.have.status(204)
//                 })
//         })
//     })

// })
