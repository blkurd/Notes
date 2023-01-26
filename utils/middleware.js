/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express"); // import the express framework
const morgan = require("morgan"); // import the morgan request logger
/////////////////////////////////////
//// Middleware Function         ////
/////////////////////////////////////
// Now, instead of processing our middleware in server.js, we're going to
// build a function that will take the entire app as an argument, and run
// requests through all of our middleware

const middleware = (app) => {
  // middleware runs before all the routes.
  // every request is processed through our middleware before mongoose can do anything with it
  app.use(morgan("tiny")); // this is for request loggging, the 'tiny' argument declares what
  //   size of morgan log to use
  // example : GET / 304 - - 7.108 ms
  app.use(express.urlencoded({ extended: true })); //this parses urlEncoded request bodies(useful
  //   for POST and PUT requests)
  app.use(express.static("public")); // this serves static files from the 'public' folder
  app.use(express.json()); // parses incoming request payloads with JSON
  // So when we start sending data to our server to create items in our database.
  // This piece of middleware is going to be able to parse those Json payloads and turn
  //   them into something that our app can use.
};

/////////////////////////////////////
//// Export Middleware Function  ////
/////////////////////////////////////
module.exports = middleware;
