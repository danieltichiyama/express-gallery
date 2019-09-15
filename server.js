const express = require("express");
const bodyParser = require("body-parser");
const dbdecorator = require("./database/decorator");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(dbdecorator);

app.get("/", (req, res) => {
  res.send("smoke test");
});

app.listen(PORT, () => {
  console.log(`PORT ${PORT} open for business`);
});
