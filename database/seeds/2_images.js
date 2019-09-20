exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("images")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("images").insert([
        {
          user_id: 1,
          title: "GOOD graffiti art",
          url: "https://unsplash.com/photos/S_xVV-l8Q4I",
          org_id: 1,
          author: "Gemma Evans"
        },
        {
          user_id: 2,
          title: "Do Something Great",
          url: "https://unsplash.com/photos/oqStl2L5oxI",
          org_id: 1,
          author: "Clark Tibbs"
        },
        {
          user_id: 3,
          title: "ghostlight coffee",
          url: "https://unsplash.com/photos/x-f-YuU1nw8",
          org_id: 1,
          author: "Don Ross III"
        }
      ]);
    });
};
