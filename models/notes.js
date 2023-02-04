//////////////////////////////////////////////////////////////
//// Our schema and model for the note resource          ////
//////////////////////////////////////////////////////////////
// This is the old mongoose import and we want the mongoose object to relate to our db
// so we are going to bring in the mongoose connection from our utils
// const mongoose = require('mongoose') // import mongoose
const mongoose = require("../utils/connection"); //import mongoose from utils
// const { stringify } = require('querystring')
// import our commentSchema, to use as a subdocument
const commentSchema = require("./comment");
// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose;

// notes Schema
const notesSchema = new Schema(
  {
    title: {
      type: String,
    },

    text: {
      type: String,
    },

    author: {
      type: String,
    },

    owner: {
      // this is where we set up an objectId reference
      // by declaring that as the type
      type: Schema.Types.ObjectId,
      // this line tells us which model to look at
      ref: "User",
    },

    comments: [commentSchema],
  },
  { timestamps: true }
);

// make the notes model
// the model method takes two argumetns
// the first is what we call our model
// the second is the schema used to build the model
// The mongoose connection is attached to our notes model so we don't
// even need the model because the Controller file talks to the model
// file which talks to the connection file and the controller file talks
// to server.js
const Note = model("Note", notesSchema);

//////////////////////////////////////////////////////////////
//// Export model          ////
//////////////////////////////////////////////////////////////

module.exports = Note;
