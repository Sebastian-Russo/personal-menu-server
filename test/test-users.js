"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Users endpoint", function() {
  const username = "exampleUser";
  const password = "examplePass";
  const firstName = "Example";
  const lastName = "User";
  const categoryList = [];
  const groceryList = [];
  
  const usernameB = "exampleUserB";
  const passwordB = "examplePassB";
  const firstNameB = "ExampleB";
  const lastNameB = "UserB";



  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.deleteMany({});
  });

  describe("POST", function() {
    it("Should reject users with missing username", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          password,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("Missing field");
          expect(res.body.location).to.equal("username");
        });
    });

    it("Should reject users with missing password", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("Missing field");
          expect(res.body.location).to.equal("password");
        });
    });

    it("Should reject users with non-string username", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username: 1234,
          password,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("username");
        });
    });

    it("Should reject users with non-string password", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password: 1234,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("password");
        });
    });

    it("Should reject users with non-string first name", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password,
          firstName: 1234,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            console.log(err)
            console.error(err)
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("firstName");
        });
    });

    it("Should reject users with non-string last name", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password,
          firstName,
          lastName: 1234
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Incorrect field type: expected string"
          );
          expect(res.body.location).to.equal("lastName");
        });
    });

    it("Should reject users with non-trimmed username", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username: ` ${username} `,
          password,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Cannot start or end with whitespace"
          );
          expect(res.body.location).to.equal("username");
        });
    });

    it("Should reject users with non-trimmed password", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password: ` ${password} `,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Cannot start or end with whitespace"
          );
          expect(res.body.location).to.equal("password");
        });
    });

    it("Should reject users with empty username", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username: "",
          password,
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Must be at least 1 characters long"
          );
          expect(res.body.location).to.equal("username");
        });
    });

    it("Should reject users with password less than ten characters", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password: "123456789",
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Must be at least 10 characters long"
          );
          expect(res.body.location).to.equal("password");
        });
    });

    it("Should reject users with password greater than 72 characters", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password: new Array(73).fill("a").join(""),
          firstName,
          lastName
        })
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })        
        .catch(err => {
        //   if (err instanceof chai.AssertionError) {
        //     throw err;
        //   }
            console.log('ERROR', err)
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal(
            "Must be at most 72 characters long"
          );
          expect(res.body.location).to.equal("password");
        });
    });

    it("Should reject users with duplicate username", function() {
      // Create an initial user
      return User.create({
        username,
        password,
        firstName,
        lastName
      })
        .then(() =>
          // Try to create a second user with the same username
          chai
            .request(app)
            .post("/api/users")
            .send({
              username,
              password,
              firstName,
              lastName
            })
        )
        .then((res) => {
            console.log('RESPONSE BODY', res.body)
            // expect.fail(null, null, "Request should not succeed")
        })
        .catch(err => {
            console.error('error', err)
            if (err instanceof chai.AssertionError) {
                throw err;
            }
            console.log('ERROR', err)
          const res = err.response;
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal("ValidationError");
          expect(res.body.message).to.equal("Username already taken");
          expect(res.body.location).to.equal("username");
        });
    });

    it("Should create a new user", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password,
          firstName,
          lastName
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("username", "firstName", "lastName", "categoryList", "groceryList", "id");
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
          return user.validatePassword(password);
        })
        .then(passwordIsCorrect => {
          expect(passwordIsCorrect).to.be.true;
        });
    });

    it("Should trim firstName and lastName", function() {
      return chai
        .request(app)
        .post("/api/users")
        .send({
          username,
          password,
          firstName: ` ${firstName} `,
          lastName: ` ${lastName} `,
          categoryList: [],
          groceryList: []
        })
        .then(res => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("username", "firstName", "lastName", "categoryList", "groceryList", "id");
          expect(res.body.username).to.equal(username);
          expect(res.body.firstName).to.equal(firstName);
          expect(res.body.lastName).to.equal(lastName);
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.firstName).to.equal(firstName);
          expect(user.lastName).to.equal(lastName);
        });
    });
  });

  describe("GET", function() {
    it("Should return an empty array initially", function() {
      return chai
        .request(app)
        .get("/api/users")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(0);
        });
    });
    
    it("Should return an array of users", function() {
      return User.create(
        {
          username,
          password,
          firstName,
          lastName
        },
        {
          username: usernameB,
          password: passwordB,
          firstName: firstNameB,
          lastName: lastNameB
        }
      )
        .then(() => chai.request(app).get("/api/users"))
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(2);
          expect(res.body[0]).to.deep.equal({
            username,
            firstName,
            lastName,
            categoryList,
            groceryList,
            id: res.body[0].id
          });
          expect(res.body[1]).to.deep.equal({
            username: usernameB,
            firstName: firstNameB,
            lastName: lastNameB,
            categoryList,
            groceryList,
            id: res.body[1].id
          });
        });
    });
  });

    describe('PUT Endpoint', () => {

        let authToken;
        let userId;

        function createMockUser() {
            console.info('creating mock user');
            return chai.request(app)
                .post('/api/users/')
                .send({
                    username: 'username', 
                    password: 'password12',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    groceryList: [],
                    categoryList: []
                })
                .then(() => logUserIn())
                .catch(err => console.log(err))
        }

        beforeEach(() => {
            return createMockUser();
        })

        function logUserIn() {
            console.info('loggin in')
            return chai.request(app) // returns a promise, chai.request makes http request to server (app), like app.express uses 'app' too 
                .post('/api/auth/login')  // chained post method, path 
                .send({username: 'username', password: 'password12'}) // payload/ req.body 
                .then(res => { // res.body 
                    authToken = res.body.authToken // set global variable to use throughout testing
                    userId = res.body.userObj.id  // set global variable to use throughout testing
                    return seedRecipeData(userId)  // call seedRecipeData with userId, just as if a user logged in, and added a recipe, connected to their id 
                })
                .catch(err => console.log(err))  
        }

        it.only('Should update user lists: (categoryList, groceryList)', () => {
            const updatedUser = {
                'id': userId,
                'groceryList': ['item1', 'item2'],
                'categoryList': ['brunch', 'supper']
            }
            console.log("userId", userId, "auth", authToken)
            return chai.request(app)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedUser)
            .then(res => {
                expect(res).to.have.status(204)
                return User.findById(userId);
            })
            .then(user => {
                expect(user.groceryList).to.deep.equal(['item1', 'item2'])
                expect(user.categoryList).to.deep.equal(['brunch', 'supper'])
            })
        })

    })  


});
