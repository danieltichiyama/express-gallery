const User = require("./models/User");
const Image = require("./models/Image");
const Org = require("./models/Organization");

module.exports = function(req, res, next) {
  req.db = {
    User: User,
    Image: Image,
    Org: Org
  };

  next();
};
