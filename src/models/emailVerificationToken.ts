import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface EmailVerificationTokenTable {
  id: Generated<number>;
  userId: number;
  token: string;
  expiresAt: Date;
}

export type IEmailVerificationToken = Selectable<EmailVerificationTokenTable>;
export type NewEmailVerificationToken = Insertable<EmailVerificationTokenTable>;
export type EmailVerificationTokenUpdate =
  Updateable<EmailVerificationTokenTable>;
