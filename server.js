/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express");
const { request } = require("http");
const morgan = require("morgan");
require("dotenv").config();
const path = require("path");
const NoteRouter = require("./controllers/noteControllers");
const UserRouter = require("./controllers/userControllers");
const CommentRouter = require("./controllers/commentControllers");
const middleware = require("./utils/middleware");

const app = require("liquid-express-views")(express());

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////

middleware(app);

/////////////////////////////////////
//// Routes                      ////
/////////////////////////////////////

// Home Route

app.get("/", (req, res) => {
  // destructure our user info
  const { username, loggedIn, userId } = req.session;
  res.render("home.liquid", { username, loggedIn, userId });
});

app.use("/notes", NoteRouter);
app.use("/comments", CommentRouter);
app.use("/users", UserRouter);

// this renders our error page
// gets the error from a url req query
app.get("/error", (req, res) => {
  const error = req.query.error || "This page does not exist";

  res.render("error.liquid", { error, ...req.session });
});

// this catchall route will redirect a user to the error page
app.all("*", (req, res) => {
  res.redirect("/error");
});

/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Now listening to the sweet sounds of port: ${PORT}`)
);

// END
