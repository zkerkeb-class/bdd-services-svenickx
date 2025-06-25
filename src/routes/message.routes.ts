import { Router } from "express";
import MessageController from "../controllers/message.controller";
import UserMiddleware from "../middlewares/user.middlewares";

export default class MessageRoutes {
  router: Router;

  constructor(
    private readonly userMiddleware: UserMiddleware,
    private readonly messageController: MessageController
  ) {
    this.router = Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router.get(
      "/",
      this.userMiddleware.isLogged,
      this.messageController.getAll
    );

    this.router.post(
      "/",
      this.userMiddleware.isLogged,
      this.messageController.add
    );
  }
}
