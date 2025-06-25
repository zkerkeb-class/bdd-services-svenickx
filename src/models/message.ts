import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface MessageTable {
  id: Generated<number>;
  userId: number;
  content: string;
  createdAt: Generated<Date>;
}

export type IMessage = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type MessageUpdate = Updateable<MessageTable>;

export type IMessageExt = IMessage & { firstname?: string; lastname?: string };
