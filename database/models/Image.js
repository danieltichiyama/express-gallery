const bookshelf = require("../bookshelf");

class Image extends bookshelf.Model {
  get tableName() {
    return "images";
  }
  get hasTimestamps() {
    return true;
  }

  org() {
    return this.belongsTo("Organization");
  }

  user() {
    return this.belongsTo("User");
  }
}

module.exports = bookshelf.model("Image", Image);
