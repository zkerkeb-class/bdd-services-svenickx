import { Kysely } from "kysely";
import { Database } from "../config/db";
import { NewSubscription } from "../models/subscription";

export default class SubscriptionRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async getByUserId(id: number) {
    return this.db
      .selectFrom("subscription")
      .selectAll()
      .where("userId", "=", id)
      .where("status", "=", "active")
      .executeTakeFirst();
  }

  async insert(subscription: NewSubscription) {
    return this.db
      .insertInto("subscription")
      .values(subscription)
      .returningAll()
      .execute();
  }

  async cancel(userId: number, subId: string) {
    return this.db
      .updateTable("subscription")
      .set({ status: "canceled" })
      .where("userId", "=", userId)
      .where("sub_id", "=", subId)
      .execute();
  }
}
