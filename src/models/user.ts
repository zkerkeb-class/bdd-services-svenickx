import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
  id: Generated<number>;
  email: string;
  emailVerified: boolean;
  password?: string;
  firstname?: string;
  lastname?: string;
  providerName?: string;
  providerId?: string;
  createdAt: Generated<Date>;
}

export type UserWithPassword = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
export type IUser = Omit<UserWithPassword, "password">;
