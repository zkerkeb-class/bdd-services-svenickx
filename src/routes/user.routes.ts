import { Router } from "express";
import UserController from "../controllers/user.controller";

export default class UserRouter {
  router: Router;

  constructor(private readonly userController: UserController) {
    this.router = Router();
    this.createRoutes();
  }

  private createRoutes() {
    this.router
      .route("/getUserByEmail/:email")
      .get(this.userController.getUserByEmail);
    this.router
      .route("/getUserByEmail/:userId")
      .get(this.userController.getUserById);

    this.router.route("/createUser").post(this.userController.createUser);
  }
}
