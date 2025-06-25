import { NextFunction, Request, Response } from "express";
import SubscriptionRepository from "../repositories/subscription.repository";
import { fetchApi } from "../services/fetch.service";

export default class SubscriptionMiddleware {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  hasSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    const subscription = await this.subscriptionRepository.getByUserId(user.id);
    if (!subscription) {
      const response = await fetchApi(
        `${process.env.PAYMENT_SERVICE_URL}payment`,
        "post",
        {
          userId: user.id,
        }
      );
      if (!response.success) {
        res.status(response.code).json({
          message: "Failed to create session",
        });
        return;
      } else {
        res.status(200).json({
          redirectUrl: response.data.url,
        });
        return;
      }
    }

    next();
  };
}
