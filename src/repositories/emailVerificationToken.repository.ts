import { Kysely } from "kysely";
import { Database } from "../config/db";
import {
  IEmailVerificationToken,
  NewEmailVerificationToken,
} from "../models/emailVerificationToken";

export default class EmailVerificationTokenRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async insert(
    emailVerificationToken: NewEmailVerificationToken
  ): Promise<IEmailVerificationToken> {
    return await this.db
      .insertInto("emailVerificationToken")
      .values(emailVerificationToken)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getByToken(
    token: string
  ): Promise<IEmailVerificationToken | undefined> {
    return await this.db
      .selectFrom("emailVerificationToken")
      .selectAll()
      .where("emailVerificationToken.token", "=", token)
      .where("emailVerificationToken.expiresAt", ">=", new Date())
      .executeTakeFirst();
  }
}
