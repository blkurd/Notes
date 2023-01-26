//////////////////////////////////////////////////////////////
//// Our schema and model for the fruit resource          ////
//////////////////////////////////////////////////////////////
const mongoose = require('mongoose') // import mongoose
const { stringify } = require('querystring')

// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// notes Schema
const notesSchema = new Schema ({
        owner: String,
        title: String,
        text : String,
        color : String
})

// make the notes model
// the model method takes two argumetns 
// the first is what we call our model 
// the second is the schema used to build the model

const Note = model ('Note', notesSchema )


//////////////////////////////////////////////////////////////
//// Export model          ////
//////////////////////////////////////////////////////////////

module.exports = Note