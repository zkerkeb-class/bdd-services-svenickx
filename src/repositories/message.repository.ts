import { Kysely } from "kysely";
import { Database } from "../config/db";
import { IMessage, IMessageExt, NewMessage } from "../models/message";

export default class MessageRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async add(newMessage: NewMessage): Promise<IMessage> {
    return await this.db
      .insertInto("message")
      .values(newMessage)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getAll(): Promise<IMessageExt[]> {
    const messages = await this.db
      .selectFrom("message")
      .innerJoin("user", "user.id", "message.userId")
      .selectAll("message")
      .select(["user.firstname", "user.lastname"])
      .orderBy("createdAt", "desc")
      .limit(100)
      .execute();

    return messages;
  }
}
