const express = require("express");
const router = express.Router();

router.get("/smoke", (req, res) => {
  res.send("user smoke test");
});

module.exports = router;
