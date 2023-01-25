/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express"); // import the express framework
const { request } = require("http");
const mongoose = require("mongoose"); // import the mongoose library
const morgan = require("morgan"); // import the morgan request logger
require("dotenv").config(); // Load my ENV file's variables
const path = require("path"); // import path module

/////////////////////////////////////
//// Database Connection         ////
/////////////////////////////////////

const Note = require("./models/notes");

/////////////////////////////////////
//// Database Connection         ////
/////////////////////////////////////
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL;
// here is our DB config object
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG);

// Tell mongoose what to do with certain events
// what happens when we open, diconnect, or get an error
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (err) => console.log("An error occurred: \n", err));

/////////////////////////////////////
//// Create our Express App Object //
/////////////////////////////////////
const app = express();

/////////////////////////////////////
//// Middleware                     ////
/////////////////////////////////////

// middleware runs before all the routes.
// every request is processed through our middleware before mongoose can do anything with it
app.use(morgan("tiny")); // this is for request loggging, the 'tiny' argument declares what size of morgan log to use
// example : GET / 304 - - 7.108 ms
app.use(express.urlencoded({ extended: true })); //this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")); // this serves static files from the 'public' folder
app.use(express.json()); // parses incoming request payloads with JSON
// So when we start sending data to our server to create items in our database.
// This piece of middleware is going to be able to parse those Json payloads and turn them into something that our app can use.

/////////////////////////////////////
//// Routes                      ////
/////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Server is live, ready for requests");
});

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// Note -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
app.get("/notes/seed", (req, res) => {
  // array of starter resources(Notes)
  const startNotes = [
    { title: "", text: "", color: "yellow" },
    { title: "", text: "", color: "purple" },
  ];
// These two lines is to check if the schema is working on the 'localhost//notes/seed' or not
  // console.log('the starter notes', startNotes)
  // res.json({startNotes: startNotes})

  // then we delete every note in the database(all instances of this resource) 
 //  We deletemany first so that we can go to this seed page multiple times without
//  creating the same page over and over again. 
  Note.deleteMany({}).then(() => {
    // then we'll seed(create) our starter notes
    Note.create(startNotes)
      // tell our db what to do with success and failures
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log("The following error occurred: \n", err));
  });
});

// // index route -> displays all notes
// app.get("/notes", (req, res) => {
//   // find all the notes
//   Note.find({})
//     // send json if successful
//     .then((notes) => {
//       res.json({ notes: notes });
//     })
//     // catch errors if they occur
//     .catch((err) => console.log("The following error occurred: \n", err));
// });

/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Now listening to the sweet sounds of port: ${PORT}`)
);

// END
