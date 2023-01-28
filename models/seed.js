
/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Note = require('./notes')

// Subdocuments are not mongoose models. That means they don't have their own collection, 
// and they don't come with the same model methods that we're used 
// to(they have some their own built in.)
// This also means, that a subdoc is never going to be viewed without 
// it's parent document. We'll never see a comment without seeing the 
// note it was commented on first.
// This also means, that when we make a subdocument, we must MUST refer 
// to the parent so that mongoose knows where in mongodb to store this subdocument

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// Note -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices


// Here, we'll add our seed script
// this will seed our database for us, just like our seed route did
// the difference is, only an 'administrative' type of user can run this script
// this script will eventually be run with the command `npm run seed`


// This is our old seed route (for reference)
// There are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices

// router.get("/seed", (req, res) => {
//     // array of starter resources(Notes)
//     const startNotes = [
//       { owner: "" , title: "", text: "", color: "yellow" },
//       { owner: "" , title: "", text: "", color: "purple" },
//     ];
//     // These two lines is to check if the schema is working on the 'localhost//notes/seed' or not
//     // console.log('the starter notes', startNotes)
//     // res.json({startNotes: startNotes})
  
//     // then we delete every note in the database(all instances of this resource)
//     //  We deletemany first so that we can go to this seed page multiple times without
//     //  creating the same page over and over again.
//     Note.deleteMany({}).then(() => {
//       // then we'll seed(create) our starter notes
//       Note.create(startNotes)
//         // tell our db what to do with success and failures
//         .then((data) => {
//           res.json(data);
//         })
//         .catch((err) => console.log("The following error occurred: \n", err));
//     });
//   });


/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(notes)
    const startNotes = [
              { owner: "" , title: "", text: "", color: "yellow" },
              { owner: "" , title: "", text: "", color: "purple" },
            ];
    // then we delete every note in the database(all instances of this resource)
    // this will delete any notes that are not owned by a user
    Note.deleteMany({ owner: null })
        .then(() => {
            // then we'll seed(create) our starter notes
            Note.create(startNotes)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created notes: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})