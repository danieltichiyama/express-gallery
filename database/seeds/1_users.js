const bcrypt = require("bcryptjs");

function makeUsers(num, str) {
  let array = [
    {
      username: "administrator",
      password: bcrypt.hashSync("admin", 12),
      permissions: "admin"
    },
    {
      username: "unsplash",
      password: bcrypt.hashSync("unsplash", 12),
      permissions: "user",
      org: "Unsplash",
      orgURL: "unsplash.com"
    }
  ];

  for (i = 0; i < num; i++) {
    let object = {};
    object.username = "user" + i;
    object.password = bcrypt.hashSync("password" + i, 12);
    object.permissions = "user";
    array.push(object);
  }

  return array;
}

let users = makeUsers(2);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(users);
    });
};
