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