import { Request, Response } from "express";
import { DefaultEventsMap, Server } from "socket.io";
import MessageRepository from "../repositories/message.repository";
import { fetchApi } from "../services/fetch.service";

export default class MessageController {
  constructor(
    private readonly io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      any
    >,
    private readonly messageRepository: MessageRepository
  ) {}

  add = async (req: Request, res: Response) => {
    const { content } = req.body;
    const { user } = res.locals;

    if (!user.id || !content) {
      res.status(400).json({ error: "userId and content are required" });
      return;
    }

    //#region Moderation

    // const moderationResponse = await fetchApi(
    //   `${process.env.IA_SERVICE_URL}moderate`,
    //   "post",
    //   {
    //     content,
    //   }
    // );

    // if (!moderationResponse.success) {
    //   res.status(moderationResponse.code).json({ error: "Something went wrong" });
    //   return;
    // }

    // if (moderationResponse.data.flagged) {
    //   res.status(400).json({
    //     error: "Message flagged",
    //     reason: moderationResponse.data.reason,
    //   });
    //   return;
    // }

    //#endregion

    //#region Notification

    const notificationResponse = await fetchApi(
      `${process.env.NOTIF_SERVICE_URL}message`,
      "post",
      {
        userId: user.id,
        content,
      }
    );
    if (!notificationResponse.success) {
      res.status(notificationResponse.code).json({
        error: "Something went wrong",
      });
      return;
    }

    //#endregion

    const newMessage = await this.messageRepository.add({
      userId: user.id,
      content,
    });

    this.io.emit("message", {
      ...newMessage,
      firstname: user.firstname,
      lastname: user.lastname,
    });

    res.status(201).json({
      ...newMessage,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const messages = await this.messageRepository.getAll();
    res.status(200).json(messages);
  };
}
