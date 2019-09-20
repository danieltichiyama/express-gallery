const bookshelf = require("../bookshelf");

class Organization extends bookshelf.Model {
  get tableName() {
    return "organizations";
  }
  get hasTimestamps() {
    return true;
  }

  users() {
    return this.hasMany("User");
  }

  images() {
    return this.hasMany("Image");
  }
}

module.exports = bookshelf.model("Organization", Organization);
