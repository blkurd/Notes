/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express");
require("dotenv").config();
const Note = require("../models/notes");

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router();

//////////////////////////////
//// Routes               ////
//////////////////////////////

// index route
// Read-> finds and displays all notes
router.get("/", (req, res) => {
  const { username, loggedIn, userId } = req.session;
  // find all the notes
  Note.find({})
    // there's a built in function that runs before the rest of the promise chain
    // this function is called populate, and it's able to retrieve info
    //  from other documents in other collections
    .populate("owner", "username")
    .populate("comments.author", "-password")
    // send json if successful
    .then((notes) => {
      // res.json({ notes: notes });
      // now that we have liquid installed we need to use render as a response for our controllers
      res.render("notes/index", { notes, username, loggedIn, userId });
    })
    // catch errors if they occur
    // .catch((err) => console.log("The following error occurred: \n", err));
    // catch errors if they occur
    .catch((err) => {
      console.log(err);
      // res.status(404).json(err)
      res.redirect(`/error?error=${err}`);
    });
});

// GET for the new page
// shows a form where a user can create a new note
router.get("/new", (req, res) => {
  res.render("notes/new", { ...req.session });
});

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post("/", (req, res) => {
  // here, we'll have something called a request body
  // inside this function, that will be called req.body
  // we want to pass our req.body to the create method
  // we want to add an owner field to our note
  // It is great that we saved the user's id on the session object
  // so it is easy for us to access that data.
  req.body.owner = req.session.userId
  
  const newNote = req.body;
  Note.create(newNote)
    // send a 201 status, along with the json response of the new note
    .then((note) => {
      // in the API server version of our code we sent json and a success msg
      // res.status(201).json({ note: note.toObject() })
      // we could redirect to the 'mine' page
      // res.status(201).redirect('/notes/mine')
      // we could also redirect to the new note's show page
      res.redirect(`/notes/${note.id}`);
    })
    // send an error if one occurs
    .catch((err) => {
      console.log(err);
      // res.status(404).json(err)
      res.redirect(`/error?error=${err}`);
    });
});

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's notes

router.get("/mine", (req, res) => {
  // find notes by ownership, using the req.session info
  Note.find({ owner: req.session.userId })
    .populate("owner", "username")
    .populate("comments.author", "-password")
    .then((notes) => {
      // if found, display the notes
      res.render("notes/index", { notes, ...req.session });
    })
    .catch((err) => {
      // otherwise throw an error
      console.log(err);
      res.redirect(`/error?error=${err}`);
    });
});

// GET route for getting json for specific user notes
// Index -> This is a user specific index route
// this will only show the logged in user's notes
router.get("/json", (req, res) => {
  // find notes by ownership, using the req.session info
  Note.find({ owner: req.session.userId })
    .populate("owner", "username")
    .populate("comments.author", "-password")
    .then((notes) => {
      // if found, display the notes
      res.status(200).json({ notes: notes });
      // res.render('notes/index', { notes, ...req.session })
    })
    .catch((err) => {
      // otherwise throw an error
      console.log(err);
      res.status(400).json(err);
    });
});

// GET request -> edit route
// shows the form for updating a note
router.get("/edit/:id", (req, res) => {
  // because we're editing a specific note, we want to be able to access the note's initial values. so we can use that info on the page.
  const noteId = req.params.id;
  Note.findById(noteId)
    .then((note) => {
      res.render("notes/edit", { note, ...req.session });
    })
    .catch((err) => {
      res.redirect(`/error?error=${err}`);
    });
});

// PUT route
// Update -> updates a specific note(only if the note's owner is updating)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  req.body.read = req.body.read === "on" ? true : false;
  Note.findById(id)
    .then((note) => {
      // if the owner of the note is the person who is logged in
      if (note.owner == req.session.userId) {
        // send success message
        // res.sendStatus(204)
        // update and save the note
        return note.updateOne(req.body);
      } else {
        // otherwise send a 401 unauthorized status
        // res.sendStatus(401)
        res.redirect(
          `/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20note`
        );
      }
    })
    .then(() => {
      // console.log('the note?', note)
      res.redirect(`/notes/mine`);
    })
    .catch((err) => {
      console.log(err);
      // res.status(400).json(err)
      res.redirect(`/error?error=${err}`);
    });
});

// DELETE route
// Delete -> delete a specific note
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      // if the owner of the note is the person who is logged in
      if (note.owner == req.session.userId) {
        // send success message
        // res.sendStatus(204)
        // delete the note
        return note.deleteOne();
      } else {
        // otherwise send a 401 unauthorized status
        // res.sendStatus(401)
        res.redirect(
          `/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20note`
        );
      }
    })
    .then(() => {
      res.redirect("/notes/mine");
    })
    .catch((err) => {
      console.log(err);
      // res.status(400).json(err)
      res.redirect(`/error?error=${err}`);
    });
});

// SHOW route
// Read -> finds and displays a single resource
router.get("/:id", async (req, res) => {
  // get the id -> save to a variable
  const id = req.params.id;
  // use a mongoose method to find using that id
  Note.findById(id)
    .populate("comments.author", "username")
    // send the note as json upon success
    .then((note) => {
      // res.json({ note: note })
      res.render("notes/show.liquid", { note, ...req.session });
    })
    // catch any errors
    .catch((err) => {
      console.log("the error", err);
      // res.status(404).json(err)
      res.redirect(`/error?error=${err}`);
    });
});


// // SHOW route
// // Read -> finds and displays a single resource
// router.get("/:id", async (req, res) => {
//   // get the id -> save to a variable
//   const id = req.params.id;
//   // use a mongoose method to find using that id
//   Note.findById(id)
//     .populate("comments.author", "username")
//     // send the note as json upon success
//     .then(async (note) => {
//       // res.json({ note: note })
//       res.render("notes/show.liquid", { note, ...req.session });
//     })
//     // catch any errors
//     .catch((err) => {
//       console.log("the error", err);
//       // res.status(404).json(err)
//       res.redirect(`/error?error=${err}`);
//     });
// });

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router;
