exports.up = function(knex) {
  return knex.schema.createTable("gallery", table => {
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
    table.text("description");
    table.string("url").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("gallery");
};
