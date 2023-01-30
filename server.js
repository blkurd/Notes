/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express"); // import the express framework
const { request } = require("http");

// We don't need the mongoose independency anyomore since we have it in the connection file.
// const mongoose = require("mongoose"); // import the mongoose library

const morgan = require("morgan"); // import the morgan request logger
require("dotenv").config(); // Load my ENV file's variables
const path = require("path"); // import path module
const NoteRouter = require("./controllers/noteControllers");
const UserRouter = require("./controllers/userControllers");
const CommentRouter = require("./controllers/commentControllers");
const middleware = require("./utils/middleware");
/////////////////////////////////////
//// Import out models         ////
/////////////////////////////////////
// We need to get rid of it (commit it out) because all of th model based stuff is happening in our
// // controllers
// const Note = require("./models/notes");

// ////////////////////////////////////
// //// Database Connection         //// Moved to connection.js
// /////////////////////////////////////
// // this is where we will set up our inputs for our database connect function
// const DATABASE_URL = process.env.DATABASE_URL;
// // here is our DB config object
// const CONFIG = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// // establish our database connection
// mongoose.connect(DATABASE_URL, CONFIG);

// // Tell mongoose what to do with certain events
// // what happens when we open, diconnect, or get an error
// mongoose.connection
//   .on("open", () => console.log("Connected to Mongoose"))
//   .on("close", () => console.log("Disconnected from Mongoose"))
//   .on("error", (err) => console.log("An error occurred: \n", err));

/////////////////////////////////////
//// Create our Express App Object //
/////////////////////////////////////
const app = express();

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
// Moved to middleware.js in Utils and our middleware is now processed by a function in the utils directory.
// This middleware function takes one argument, app, and processes requests through our middleware
middleware(app);
// // middleware runs before all the routes.
// // every request is processed through our middleware before mongoose can do anything with it
// app.use(morgan("tiny")); // this is for request loggging, the 'tiny' argument declares what size of morgan log to use
// // example : GET / 304 - - 7.108 ms
// app.use(express.urlencoded({ extended: true })); //this parses urlEncoded request bodies(useful for POST and PUT requests)
// app.use(express.static("public")); // this serves static files from the 'public' folder
// app.use(express.json()); // parses incoming request payloads with JSON
// // So when we start sending data to our server to create items in our database.
// // This piece of middleware is going to be able to parse those Json payloads and turn them into something that our app can use.

/////////////////////////////////////
//// Routes                      ////
/////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Server is live, ready for requests");
});

// This is not where we register our routes, this is how server.js knows to send the
// correct response
// app.use, when we register a route, needs two arguments
// the first arg is the base URL, second arg is the file to use.

app.use("/notes", NoteRouter);
app.use("/comments", CommentRouter);
app.use("/users", UserRouter);

// All moved to noteControllers
// // we're going to build a seed route
// // this will seed the database for us with a few starter resources
// // There are two ways we will talk about seeding the database
// // Note -> seed route, they work but they are not best practices
// // Second -> seed script, they work and they ARE best practices
// app.get("/notes/seed", (req, res) => {
//   // array of starter resources(Notes)
//   const startNotes = [
//     { title: "", text: "", color: "yellow" },
//     { title: "", text: "", color: "purple" },
//   ];
//   // These two lines is to check if the schema is working on the 'localhost//notes/seed' or not
//   // console.log('the starter notes', startNotes)
//   // res.json({startNotes: startNotes})

//   // then we delete every note in the database(all instances of this resource)
//   //  We deletemany first so that we can go to this seed page multiple times without
//   //  creating the same page over and over again.
//   Note.deleteMany({}).then(() => {
//     // then we'll seed(create) our starter notes
//     Note.create(startNotes)
//       // tell our db what to do with success and failures
//       .then((data) => {
//         res.json(data);
//       })
//       .catch((err) => console.log("The following error occurred: \n", err));
//   });
// });

// // index route
// // Read-> finds and displays all notes
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

// // PUT route
// // Update -> updates a specific note
// // PUT replaces the entire document with a new document from the req.body
// // PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
// app.put('/notes/:id', (req, res) => {
//     // save the id to a variable for easy use later
//     const id = req.params.id
//     // save the request body to a variable for easy reference later
//     const updatedNote = req.body
//     // we're going to use the mongoose method:
//     // findByIdAndUpdate
//     // eventually we'll change how this route works, but for now,
//     // we'll do everything in one shot, with findByIdAndUpdate
//     Note.findByIdAndUpdate(id, updatedNote, { new: true })
//         .then(note => {
//             console.log('the newly updated note', note)
//             // update success message will just be a 204 - no content
//             res.sendStatus(204)
//         })
//         .catch(err => console.log(err))
// })

// // DELETE route
// // Delete -> delete a specific note

// app.delete('/notes/:id', (req, res) => {
//     // get the id from the req
//     const id = req.params.id
//     // find and delete the note
//     Note.findByIdAndRemove(id)
//         // send a 204 if successful
//         .then(() => {
//             res.sendStatus(204)
//         })
//         // send an error if not
//         .catch(err => console.log(err))
// })

// // SHOW route
// // Read -> finds and displays a single resource
// app.get("/notes/:id", (req, res) => {
//   // get the id -> save to a variable
//   const id = req.params.id;
//   // use a mongoose method to find using that id
//   Note.findById(id)
//     // send the note as json upon success
//     .then((note) => {
//       res.json({ note: note });
//     })
//     // catch any errors
//     .catch((err) => console.log(err));
// });

// // CREATE route
// // Create -> receives a request body, and creates a new document in the database
// app.post("/notes", (req, res) => {
//   // here, we'll have something called a request body
//   // inside this function, that will be called req.body
//   // we want to pass our req.body to the create method
//   const newNote = req.body;
//   Note.create(newNote)
//     // send a 201 status, along with the json response of the new note
//     .then((note) => {
//       res.status(201).json({ note: note.toObject() });
//     })
//     // send an error if one occurs
//     .catch((err) => console.log(err));
// });

/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Now listening to the sweet sounds of port: ${PORT}`)
);

// END
