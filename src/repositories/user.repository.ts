import { Kysely } from "kysely";
import { Database } from "../config/db";
import { IUser, NewUser } from "../models/user";

export default class UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async getUserByEmail(email: string): Promise<IUser | undefined> {
    return await this.db
      .selectFrom("user")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }

  async getUserById(userId: number): Promise<IUser | undefined> {
    return await this.db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();
  }

  async createUser(user: NewUser): Promise<IUser> {
    try {
      return await this.db
        .insertInto("user")
        .values(user)
        .returning(["id", "email", "username", "createdAt"])
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error("🚀 ~ UserRepository ~ createUser ~ error:", error);
      throw new Error("Failed to create user");
    }
  }
}
