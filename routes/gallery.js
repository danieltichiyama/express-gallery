const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
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

router.get("/gallery/:id", (req, res) => {
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

router.get("/gallery/new", (req, res) => {
  res.send("this will be the page where you can upload new photos.");
});

router.post("/gallery", (req, res) => {
  res.send(
    "this is how a new photo will be uploaded, it will send you to the gallery/:id route for the new image."
  );
});

router.get("/gallery/:id/edit", (req, res) => {
  res.send("this will be the page where you can change an uploaded image.");
});

router.put("/gallery/:id", (req, res) => {
  res.send(
    "this is how a photo will be edited, it will send you to the gallery/:id route for the edited image."
  );
});

router.delete("/gallery/:id", (req, res) => {
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

module.exports = router;
