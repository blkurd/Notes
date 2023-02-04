/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////

const mongoose = require("../utils/connection");
const Note = require("./notes");

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection;

db.on("open", () => {
  // array of starter resources(notes)
  const startNotes = [
    { title: "sometitle", text: "sometext", author: "someone" },
  ];
  // then we delete every note in the database(all instances of this resource)
  // this will delete any notes that are not owned by a user
  Note.deleteMany({ owner: null })
    .then(() => {
      // then we'll seed(create) our starter notes
      Note.create(startNotes)
        // tell our app what to do with success and failures
        .then((data) => {
          console.log("here are the created notes: \n", data);
          // once it's done, we close the connection
          db.close();
        })
        .catch((err) => {
          console.log("The following error occurred: \n", err);
          // always close the connection
          db.close();
        });
    })
    .catch((err) => {
      console.log(err);
      // always make sure to close the connection
      db.close();
    });
});
