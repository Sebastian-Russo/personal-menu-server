'use strict';
require('dotenv').config(); //
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');


const { app, runServer, closeServer } = require("../server");
const { Recipe } = require("../recipes/models");
const { TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipe List', function() {

    let authToken;
    let recipeId;

    const mockRecipe = {
        name: faker.lorem.word,
        categories: faker.lorem.word,
        ingredients: faker.lorem.word,
        directions: faker.lorem.word
    }

    function createMockUser() {
        console.info('creating mock user');
        return chai.request(app)
        .post('/api/users/')
        .then(res => seddRecipeData(res.body.id))
        .then(() => logUserIn())
        .catch(err => console.log(err))
    }

    function seedRecipeData(parentId) {
        console.log('seeding recipe data');
        return Recipe.create(mockRecipe)
            .then(recipe => {
                recipe._parent = parentId;
                return chai.request(app)
                    .post('/api/recipe')
                    .send(recipe)
                    .then(res => recipeId = res.body.id)
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    function logUserIn() {
        console.log('loggin in')
        return chai.request(app)
            .post('/api/auth/login')
            .send({username: 'username', password: 'password'})
            .then(res => authToken = res.body.authToken)
            .catch(err => console.log(err))
    }

    before(() => {
        return runServer(TEST_DATABASE_URL)
    })

    afterEach(() => {
        return tearDownDb()
    })

    after(() => {
        return closeServer()
    })

    describe('GET requests', () => {

        beforeEach(() => {
            return createMockUser()
        })
        
        it('should list all the user recipes on GET', function() {
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