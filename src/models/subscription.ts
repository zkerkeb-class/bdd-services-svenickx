import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface SubscriptionTable {
  id: Generated<number>;
  userId: number;
  sub_id: string;
  itemId: string;
  customerId: string;
  status: string;
}

export type ISubscription = Selectable<SubscriptionTable>;
export type NewSubscription = Insertable<SubscriptionTable>;
export type SubscriptionUpdate = Updateable<SubscriptionTable>;
