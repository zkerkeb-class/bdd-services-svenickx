import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("firstname", "text")
    .addColumn("lastname", "text")
    .addColumn("password", "text")
    .addColumn("providerName", "text")
    .addColumn("providerId", "text")
    .addColumn("emailVerified", "boolean", (col) =>
      col.notNull().defaultTo(false)
    )
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("emailVerificationToken")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "integer", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expiresAt", "timestamp", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("message")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "integer", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("subscription")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "integer", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("sub_id", "text", (col) => col.notNull())
    .addColumn("itemId", "text", (col) => col.notNull())
    .addColumn("customerId", "text", (col) => col.notNull())
    .addColumn("status", "text", (col) => col.notNull())
    .execute();
}
