const bookshelf = require("../bookshelf");

class User extends bookshelf.Model {
  get hidden() {
    return ["password", "created_at", "updated_at"];
  }

  get tableName() {
    return "users";
  }
  get hasTimestamps() {
    return true;
  }

  images() {
    return this.hasMany("Image");
  }
}

module.exports = bookshelf.model("User", User);
