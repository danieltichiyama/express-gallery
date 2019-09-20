const bcrypt = require("bcryptjs");
const adminPW = bcrypt.hashSync("admin", 12);

function makeUsers(num, str) {
  let array = [
    {
      username: "administrator",
      password: adminPW,
      permissions: "site_admin"
    },
    {
      username: "unsplash_admin",
      password: bcrypt.hashSync("unsplashadmin", 12),
      permissions: "org_admin",
      org_id: 1
    }
  ];
  for (i = 0; i < num; i++) {
    let object = {};
    object.username = "user" + i;
    object.password = bcrypt.hashSync("password" + i, 12);
    object.permissions = "std_user";
    object["org_id"] = 1;
    array.push(object);
  }

  return array;
}

let users = makeUsers(4);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(users);
    });
};
