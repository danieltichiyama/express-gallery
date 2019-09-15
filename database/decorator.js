const User = require("./models/User");
const Image = require("./models/Image");

module.exports = function(req, res, next) {
  req.db = {
    User: User,
    Image: Image
  };

  next();
};
