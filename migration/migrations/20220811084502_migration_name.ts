import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(process.env.DB_COMMENTS_TABLE!, (table) => {
    table.increments("id");
    table.integer("parentId").references("id").inTable("comments");
    table.string("content", 280).notNullable();
    table.integer("upvote").defaultTo(0);
    table.timestamp("createdAt", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("modifiedAt", { useTz: true }).defaultTo(knex.fn.now());
  })
  .createTable(process.env.DB_USERS_TABLE!, (table) => {
    table.increments("id");
    table.integer("userId").notNullable();
    table.integer("commentId").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(process.env.DB_COMMENTS_TABLE!).dropTable(process.env.DB_USERS_TABLE!);
}
