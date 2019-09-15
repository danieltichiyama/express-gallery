exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("images")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("images").insert([
        {
          user_id: 1,
          description: "GOOD graffiti art",
          url: "https://unsplash.com/photos/S_xVV-l8Q4I"
        },
        {
          user_id: 2,
          description: "Do Something Great",
          url: "https://unsplash.com/photos/oqStl2L5oxI"
        },
        {
          user_id: 2,
          description: "ghostlight coffee",
          url: "https://unsplash.com/photos/x-f-YuU1nw8"
        }
      ]);
    });
};
