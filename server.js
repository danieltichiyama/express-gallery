const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const dbdecorator = require("./database/decorator");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

require("dotenv").config();

const app = express();
const PORT = 8080;
const saltRounds = 12;
const User = require("./database/models/User");
const client = redis.createClient({ url: process.env.REDIS_URL });

app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(dbdecorator);

app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login.html");
  }
}

passport.use(
  new LocalStrategy(function(username, password, done) {
    return new User({ username: username })
      .fetch()
      .then(user => {
        if (user === null) {
          return done(null, false, { message: "bad username or password" });
        } else {
          user = user.toJSON();
          bcrypt.compare(password, user.password).then(res => {
            if (res) {
              return done(null, user);
            } else {
              return done(null, false, { message: "bad username or password" });
            }
          });
        }
      })
      .catch(err => {
        console.log("error: ".err);
        return done(err);
      });
  })
);

passport.serializeUser(function(user, done) {
  console.log("serializing");

  return done(null, { id: user.id, username: user.username });
});

passport.deserializeUser(function(user, done) {
  console.log("deserializing");
  console.log(user);

  return done(null, user);
});

app.use(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login.html"
  })
);

app.post("/register", (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
    }

    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }

      return new User({
        username: req.body.username,
        password: hash
      })
        .save()
        .then(user => {
          console.log(user);
          return res.redirect("/login.html");
        })
        .catch(err => {
          console.log(err);
          return res.send("Error creating account");
        });
    });
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

app.get("/", (req, res) => {
  return req.db.Image.fetchAll()
    .then(results => {
      res.send(results.toJSON()); //sends back an array of objects;
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Something went wrong, sorry about that.` });
    });
});

app.get("/gallery/:id", (req, res) => {
  return req.db.Image.where({ id: req.params.id })
    .fetch({ withRelated: ["user"] })
    .then(results => {
      res.send(results.toJSON());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: `Image not found. No image with id ${req.params.id} found in database.`
      });
    });
});

app.get("/gallery/new", (req, res) => {
  res.send("this will be the page where you can upload new photos.");
});

app.post("/gallery", isAuthenticated, (req, res) => {
  return req.db.Image.forge({
    description: req.body.description,
    user_id: req.user.id,
    url: req.body.url
  })
    .save()
    .then(results => {
      res.redirect(`/gallery/${results.id}`);
    })
    .catch(err => {
      res.status(500).json({ message: "Image could not be added." });
    });
});

app.get("/gallery/:id/edit", (req, res) => {
  res.send("this will be the page where you can change an uploaded image.");
});

app.put("/gallery/:id", isAuthenticated, (req, res) => {
  return req.db.Image.where({ id: req.params.id, user_id: req.user.id })
    .set({
      description: req.body.description,
      url: req.body.url
    })
    .save(null, { method: "update" })
    .then(results => {
      console.log("results", results.toJSON());
      res.redirect(`/`); //res.redirect(`/${results.toJSON().id}`); <-- doesn't work, 'ERROR: Cannot GET /${results.toJSON().id}'
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "You do not have permission to edit this image." });
    });
});

app.delete("/gallery/:id", isAuthenticated, (req, res) => {
  return req.db.Image.where({ id: req.params.id })
    .destroy()
    .then(results => {
      res.send(`Image with id ${req.params.id} has been successfully deleted.`);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: `Image with id ${req.params.id} could not be deleted.`
      });
    });
});

app.listen(PORT, () => {
  console.log(`PORT ${PORT} open for business`);
});
