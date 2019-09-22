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
const exphbs = require("express-handlebars");

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

app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

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
    return res.redirect("/login");
  }
}

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

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

  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser(function(user, done) {
  //returns the session object from our REDIS server and attaches it to the request (req.user), other things can be added to it if we want, but for now it only adds the user object
  console.log("deserializing");
  console.log(user);

  return done(null, user);
});

app.use(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
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
        password: hash,
        org: req.body.org,
        permissions: "user"
      })
        .save()
        .then(user => {
          console.log(user);
          return res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
          return res.send("Error creating account");
        });
    });
  });
});

app.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out");
});

app.get("/", (req, res) => {
  return req.db.Gallery.fetchAll({ withRelated: ["user"] })
    .then(results => {
      res.render("listing", { gallery: results.toJSON() });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: `Something went wrong, sorry about that.` });
    });
});

app.get("/gallery/new", isAuthenticated, (req, res) => {
  return res.render("./new");
});

app.get("/gallery/:id", isAuthenticated, (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ message: "Error: id is not an integer." });
  }

  let obj = {};

  return req.db.Gallery.where({ id: req.params.id })
    .fetch({ withRelated: ["user"] })
    .then(results => {
      console.log(results.toJSON());
      obj.image = results.toJSON();
      return req.db.Gallery.where({
        user_id: results.toJSON().user_id
      }).fetchAll();
    })
    .then(results => {
      console.log("other", results.toJSON());
      obj.other = results.toJSON().filter(function(elem) {
        return elem.id !== obj.image.id;
      });
      res.render(`detail`, obj);
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: `Image not found. No image with id ${req.params.id} found in database.`
      });
    });
});

app.post("/gallery", isAuthenticated, (req, res) => {
  return req.db.Gallery.forge({
    description: req.body.description,
    user_id: req.user.id,
    author: req.body.author,
    title: req.body.title,
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

app.get("/gallery/:id/edit", isAuthenticated, (req, res) => {
  return req.db.Gallery.where({ id: req.params.id })
    .fetch()
    .then(results => {
      results = results.toJSON();
      res.render("./edit", { image: results });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: `Image with id ${req.params.id} could not be found.`
      });
    });
});

app.put("/gallery/:id", isAuthenticated, (req, res) => {
  return req.db.Gallery.where({ id: req.params.id, user_id: req.user.id })
    .save(
      {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        url: req.body.url
      },
      { method: "update" }
    )
    .then(results => {
      console.log(results.toJSON());
      res.redirect(`/gallery/${results.toJSON().id}`);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "You do not have permission to edit this image." });
    });
});

app.delete("/gallery/:id", isAuthenticated, (req, res) => {
  return req.db.Gallery.where({ id: req.params.id, user_id: req.user.id })
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
