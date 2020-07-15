'use strict';
// an enviorment variable is basically part of the environment in which the process runs, it's value is set outside this application 
exports.PORT = process.env.PORT || 8080;
// mongodb:// is the protocol definition, localhost:27017 is the server we are connecting to, /recipe is the database we wish to connect to
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/recipe';
