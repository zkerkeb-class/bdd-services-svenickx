import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
  id: Generated<number>;
  email: string;
  password: string;
  username: string;
  createdAt: Generated<Date>;
}

export type UserWithPassword = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
export type IUser = Omit<UserWithPassword, "password">;
