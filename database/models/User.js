const bookshelf = require("../bookshelf");

class User extends bookshelf.Model {
  get tableName() {
    return "users";
  }
  get hasTimestamps() {
    return true;
  }

  org() {
    return this.belongsTo("Organization");
  }

  images() {
    return this.hasMany("Image");
  }
}

module.exports = bookshelf.model("User", User);
