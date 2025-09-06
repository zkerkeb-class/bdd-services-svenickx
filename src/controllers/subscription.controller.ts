import SubscriptionRepository from "../repositories/subscription.repository";

export default class SubscriptionController {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  create = async (req: any, res: any) => {
    const { userId, itemId, subId, customerId } = req.body;

    const session = await this.subscriptionRepository.insert({
      userId,
      itemId,
      customerId,
      sub_id: subId,
      status: "active",
    });

    res.status(200).json(session);
  };

  getSubscriptionByUserId = async (req: any, res: any) => {
    const { userId } = req.params;

    const subscription = await this.subscriptionRepository.getByUserId(userId);
    res.status(200).json(subscription);
  };

  cancel = async (req: any, res: any) => {
    const { userId, subId } = req.body;

    const result = await this.subscriptionRepository.cancel(userId, subId);
    if (result) {
      res.status(200).json({ message: "Subscription deleted successfully" });
    } else {
      res.status(404).json({ message: "Subscription not found" });
    }
  };
}
