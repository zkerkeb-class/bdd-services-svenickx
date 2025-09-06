import { Router } from "express";
import EmailVerificationTokenController from "../controllers/emailVerificationToken.controller";
import UserController from "../controllers/user.controller";
import SubscriptionMiddleware from "../middlewares/subscription.middlewares";
import UserMiddleware from "../middlewares/user.middlewares";

export default class UserRouter {
  router: Router;

  constructor(
    private readonly userMiddleware: UserMiddleware,
    private readonly userController: UserController,
    private readonly subscriptionMiddleware: SubscriptionMiddleware,
    private readonly emailVerificationTokenController: EmailVerificationTokenController
  ) {
    this.router = Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router
      .route("/me")
      .get(
        this.userMiddleware.isLogged,
        this.subscriptionMiddleware.hasSubscription,
        this.userController.getMe
      );
    this.router
      .route("/getUserByEmail/:email")
      .get(this.userController.getUserByEmail);
    this.router
      .route("/getUserById/:userId")
      .get(this.userController.getUserById);

    this.router.route("/createUser").post(this.userController.createUser);
    this.router
      .route("/activate")
      .put(this.emailVerificationTokenController.verify);
  }
}
