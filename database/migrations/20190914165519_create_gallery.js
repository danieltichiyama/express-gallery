exports.up = function(knex) {
  return knex.schema.createTable("images", table => {
    table.increments();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .notNullable();
    table
      .string("title")
      .notNullable()
      .defaultTo("Untitled");
    table
      .string("author")
      .notNullable()
      .defaultTo("Anonymous");
    table.string("description");
    table.string("url").notNullable();
    table
      .integer("org_id")
      .references("id")
      .inTable("organizations");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("images");
};
