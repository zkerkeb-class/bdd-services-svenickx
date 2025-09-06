import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserRepository from "../repositories/user.repository";

export default class UserMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  isLogged = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["access-token"];
    if (!token) {
      res.status(401).json({ message: "Access token is missing" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const { id } = decoded;
      if (!id) {
        res.status(401).json({ message: "Invalid access token" });
        return;
      }

      const user = await this.userRepository.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.locals.user = user;
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ message: "Invalid access token" });
      return;
    }
    next();
  };
}
