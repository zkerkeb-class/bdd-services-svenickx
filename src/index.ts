import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import DB from "./config/db";
import AuthController from "./controllers/user.controller";
import UserRepository from "./repositories/user.repository";
import UserRouter from "./routes/user.routes";

dotenv.config({ path: __dirname + "/../../.env" });

const app: Express = express();
app.use(express.json());

const db = new DB().db;

const userRepository = new UserRepository(db);
const userController = new AuthController(userRepository);
const userRouter = new UserRouter(userController);

app.use("/auth", userRouter.router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send();
});

const port = process.env.APP_DB_PORT || 1999;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
