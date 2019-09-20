exports.up = function(knex) {
  return knex.schema.createTable("organizations", table => {
    table.increments();
    table.string("name").notNullable();
    table.string("url");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("organizations");
};
