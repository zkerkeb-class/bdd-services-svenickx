import * as argon2 from "argon2";
import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import EmailVerificationTokenRepository from "../repositories/emailVerificationToken.repository";
import SubscriptionRepository from "../repositories/subscription.repository";
import UserRepository from "../repositories/user.repository";
import { fetchApi } from "../services/fetch.service";

export default class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly emailVerificationTokenRepository: EmailVerificationTokenRepository
  ) {}

  createUser = async (req: Request, res: Response) => {
    const {
      email,
      firstname,
      lastname,
      password,
      providerName,
      providerId,
      emailVerified,
    } = req.body;

    if (!email) {
      const message = "Missing required email";
      console.error(message);
      res.status(400).json({ message });
      return;
    }

    const fromProvider = !!providerId || !!providerName;
    const hasDefaultAuthFields = !!firstname || !!lastname || !!password;

    if (!fromProvider && (!firstname || !lastname || !password)) {
      // User from default auth
      const message = "Missing required firstname, lastname or password";
      console.error(message);
      res.status(400).json({ message });
      return;
    } else if ((!providerId || !providerName) && !hasDefaultAuthFields) {
      // User from provider
      const message = "Missing required provider";
      console.error(message);
      res.status(400).json({ message });
      return;
    }

    const userExists = await this.userRepository.getUserByEmail(email);
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    try {
      const user = await this.userRepository.createUser({
        email,
        emailVerified,
        firstname,
        lastname,
        password: password ? await argon2.hash(password) : undefined,
        providerId,
        providerName,
      });

      if (!fromProvider) {
        const token = await this.emailVerificationTokenRepository.insert({
          token: randomUUID(),
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });

        await fetchApi(
          `${process.env.NOTIF_SERVICE_URL}user/register`,
          "post",
          {
            email,
            token: token.token,
          }
        );
      }

      res.status(201).json({ data: user });
      return;
    } catch (error) {
      console.error("🚀 ~ AuthController ~ register ~ error:", error);
      res.status(500).json({ message: "Failed to create user" });
      return;
    }
  };

  getMe = async (req: Request, res: Response) => {
    const { user } = res.locals;
    let billingPortalUrl = "";

    const subscription = await this.subscriptionRepository.getByUserId(user.id);
    if (subscription) {
      const billingPortalResponse = await fetchApi(
        `${process.env.PAYMENT_SERVICE_URL}payment/${subscription.customerId}/billingPortal`,
        "get"
      );
      if (billingPortalResponse.success) {
        billingPortalUrl = billingPortalResponse.data.url;
      }
    }

    res.status(200).json({ data: { user, billingPortalUrl } });
    return;
  };

  getUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
    return;
  };

  getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await this.userRepository.getUserById(Number(userId));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
    return;
  };
}
