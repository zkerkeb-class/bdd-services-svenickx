import { Request, Response } from "express";
import EmailVerificationTokenRepository from "../repositories/emailVerificationToken.repository";
import UserRepository from "../repositories/user.repository";

export default class EmailVerificationTokenController {
  constructor(
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  verify = async (req: Request, res: Response) => {
    const { token } = req.body;

    const emailVerificationToken =
      await this.emailVerificationTokenRepository.getByToken(token);
    if (!emailVerificationToken) {
      res.status(400).json({});
      return;
    }

    const user = await this.userRepository.update(
      { emailVerified: true },
      emailVerificationToken.userId
    );
    if (!user) {
      res.status(400).json({});
    }

    res.status(200).json({});
  };
}
