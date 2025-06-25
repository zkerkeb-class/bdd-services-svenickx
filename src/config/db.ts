import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import { promises as fs } from "node:fs";
import path from "path";
import { Pool } from "pg";
import { EmailVerificationTokenTable } from "../models/emailVerificationToken";
import { MessageTable } from "../models/message";
import { SubscriptionTable } from "../models/subscription";
import { UserTable } from "../models/user";

export interface Database {
  user: UserTable;
  message: MessageTable;
  subscription: SubscriptionTable;
  emailVerificationToken: EmailVerificationTokenTable;
}

export default class DB {
  db: Kysely<Database>;

  constructor() {
    this.db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          port: Number(process.env.DB_PORT),
          password: process.env.DB_PASSWORD,
          max: 10,
          ssl: false,
        }),
      }),
      log(event) {
        if (event.level === "error") {
          console.error("Query failed : ", {
            durationMs: event.queryDurationMillis,
            error: event.error,
            sql: event.query.sql,
            // params: event.query.parameters.map(maskPII),
          });
        }
      },
    });

    this.migrateToLatest();
  }

  async migrateToLatest() {
    const migrationDb = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          port: Number(process.env.DB_PORT),
          password: process.env.DB_PASSWORD,
          max: 10,
          ssl: false,
        }),
      }),
    });

    const migrator = new Migrator({
      db: migrationDb,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, "/migrations"),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === "Success") {
        console.info(
          `migration "${it.migrationName}" was executed successfully`
        );
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      console.error("failed to migrate");
      console.error(error);
      process.exit(1);
    }

    await migrationDb.destroy();
  }
}
