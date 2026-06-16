/* eslint-disable no-undef */
const express = require("express");
const dbRouter = require("./routes/database");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/users");
const emailRouter = require("./routes/email");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8080;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
app.use("/", dbRouter);

// Routes
app.use("/bookings", bookingsRouter); // Booking form data
app.use("/users", usersRouter); // Signup, login, and forget password forms
app.use("/email", emailRouter); // Email-related routes

app
  .get("/home", (req, res) => {
    res.send("hello,world");
  })

  .listen(port, (err) => {
    if (!err) {
      console.log(`server is running on port ${port}`);
    } else {
      console.log(`server crash at ${port}`);
    }
  });
