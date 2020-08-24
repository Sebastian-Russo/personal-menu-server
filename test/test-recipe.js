'use strict';
require('dotenv').config(); //
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require("../config");

// import server.js and use destructuring assignment to create variables for app, runServer, closeServer
const { app, runServer, closeServer } = require("../server"); 
const { Recipe } = require('../recipes/models');
const { User } = require('../users')

const expect = chai.expect; // declare a variable for expect from chai import 
const should = chai.should; 

chai.use(chaiHttp);


// describe holds all the it functions 
describe('/api/recipe', function() {

    let authToken;
    let recipeID;

    // generate an object representing a recipe
    // can be used to generate seed data for db, or req.body data 
    const recipeData = {
        name: faker.lorem.word,
        categories: [ faker.lorem.word, faker.lorem.word, faker.lorem.word ],
        ingredients: {
            ingredient: faker.lorem.word,
            amount: faker.lorem.word
        },
        directions: faker.lorem.words
    }

    function createMockUser() {
        console.info('creating mock user');
        return chai.request(app)
            .post('/api/users/')
            .send({username: 'username', password: 'password', email: 'email@gamil.com'})
            .then(res => seedRecipeData(res.body.id))
            .then(() => logUserIn())
            .catch(err => console.log(err))
    }

    function seedRecipeData(parentID) { // what's 'parentID'?
        console.info('seeding recipe data');
        return Recipe.create(recipeData)
            .then(recipe => {
                recipe._parent = parentID; // ??
                return chai.request(app)
                    .post('/api/recipe')
                    .send(recipe)
                    .then(res => recipeID = res.body.id)
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function logUserIn() {
        console.info('loggin in')
        return chai.request(app)
            .post('/api/auth/login')
            .send({username: 'username', password: 'password'})
            .then(res => authToken = res.body.authToken)
            .catch(err => console.log(err))
    }

    // deletees the entire database, call it in 'afterEach'
    function tearDownDb() {
        console.warn('Deleting database');
        return mongoose.connection.dropDatabase()
    }


    /*** TEST SET UP ***/

    // before our test runs, activate the server, use separate test DB
    before(() => {
        return runServer(TEST_DATABASE_URL); // returns promise 
    })

    // zeroes out the db after each test has run 
    afterEach(() => {
        return tearDownDb();
    })

    // close server after these tests run, incase other modules need to call runServer (like users)
    after(() => {
        return closeServer();
    })


    /*** TEST ENDPOINTS  ***/

    describe('GET endpoint', () => {

        // seeds db with test data
        beforeEach(() => () => {
            return seedRecipeData();
        })

        it('should list all the recipes on ', function() {
            return chai.request(app)
                .get('api/recipes')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.be.at.least(1);
                    
                    const expectedKeys = ['userId', 'name', 'categories', 'ingredients', 'directions'];
                    res.body.forEach(function(item) {
                        expect(item).to.be.a('object');
                        expect(item).to.include.keys(expectedKeys)
                    });
                });
        });
    
    })


})