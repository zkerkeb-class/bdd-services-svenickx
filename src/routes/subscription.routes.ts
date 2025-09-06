import { Router } from "express";
import SubscriptionController from "../controllers/subscription.controller";

export default class SubscriptionRouter {
  router: Router;

  constructor(private readonly subscriptionController: SubscriptionController) {
    this.router = Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router.route("/").post(this.subscriptionController.create);
    this.router.route("/").delete(this.subscriptionController.cancel);
  }
}
