exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("gallery")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("gallery").insert([
        {
          user_id: 2,
          title: "GOOD graffiti art",
          url:
            "https://images.unsplash.com/photo-1473798486505-a5279da7afa2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1582&q=80",
          author: "Gemma Evans"
        },
        {
          user_id: 2,
          title: "Do Something Great",
          url:
            "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
          author: "Clark Tibbs"
        },
        {
          user_id: 2,
          title: "ghostlight coffee",
          url:
            "https://images.unsplash.com/photo-1485118571520-91ebb7fb2a78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=644&q=80",
          author: "Don Ross III"
        }
      ]);
    });
};
