import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import DB from "./config/db";
import EmailVerificationTokenController from "./controllers/emailVerificationToken.controller";
import MessageController from "./controllers/message.controller";
import SubscriptionController from "./controllers/subscription.controller";
import AuthController from "./controllers/user.controller";
import SubscriptionMiddleware from "./middlewares/subscription.middlewares";
import UserMiddleware from "./middlewares/user.middlewares";
import EmailVerificationTokenRepository from "./repositories/emailVerificationToken.repository";
import MessageRepository from "./repositories/message.repository";
import SubscriptionRepository from "./repositories/subscription.repository";
import UserRepository from "./repositories/user.repository";
import MessageRoutes from "./routes/message.routes";
import SubscriptionRouter from "./routes/subscription.routes";
import UserRouter from "./routes/user.routes";

dotenv.config({ path: __dirname + "/../../.env" });

const app: Express = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});
io.on("connection", async (socket) => {
  io.on("message", (message) => {
    console.log("message", message);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const db = new DB().db;

const userRepository = new UserRepository(db);
const messageRepository = new MessageRepository(db);
const subscriptionRepository = new SubscriptionRepository(db);
const emailVerificationTokenRepository = new EmailVerificationTokenRepository(
  db
);

const userMiddleware = new UserMiddleware(userRepository);
const subscriptionMiddleware = new SubscriptionMiddleware(
  subscriptionRepository
);

const userController = new AuthController(
  userRepository,
  subscriptionRepository,
  emailVerificationTokenRepository
);
const messageController = new MessageController(io, messageRepository);
const subscriptionController = new SubscriptionController(
  subscriptionRepository
);
const emailVerificationTokenController = new EmailVerificationTokenController(
  emailVerificationTokenRepository,
  userRepository
);

const userRouter = new UserRouter(
  userMiddleware,
  userController,
  subscriptionMiddleware,
  emailVerificationTokenController
);
const messageRouter = new MessageRoutes(userMiddleware, messageController);
const subscriptionRouter = new SubscriptionRouter(subscriptionController);

app.use("/auth", userRouter.router);
app.use("/message", messageRouter.router);
app.use("/subscription", subscriptionRouter.router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send();
});

const port = process.env.DB_SERVICE_PORT || 1999;
httpServer.listen(port, () => {
  console.log(`[server]: BDD is running at http://localhost:${port}`);
});
