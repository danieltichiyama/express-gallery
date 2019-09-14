exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "fatAl",
          password: "HeyHeyHey",
          email: "albert_robertson@yahoo.com"
        },
        {
          username: "jabba_the_hutt",
          password: "i<3han",
          email: "hutt_with2tees@gmail.com"
        },
        {
          username: "fatbastard12",
          password: "viciousCycle",
          email: "get.in.my.bellie@msn.com"
        }
      ]);
    });
};
