import * as argon2 from "argon2";
import { Request, Response } from "express";
import UserRepository from "../repositories/user.repository";

export default class AuthController {
  constructor(private readonly userRepository: UserRepository) {}

  createUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const userExists = await this.userRepository.getUserByEmail(email);
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    try {
      const hashedPassword = await argon2.hash(password);
      const user = await this.userRepository.createUser({
        email,
        username,
        password: hashedPassword,
      });

      res.status(201).json(user);
      return;
    } catch (error) {
      console.error("🚀 ~ AuthController ~ register ~ error:", error);
      res.status(500).json({ message: "Failed to create user" });
      return;
    }
  };

  getUserByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
    return;
  };

  getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await this.userRepository.getUserById(Number(userId));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
    return;
  };
}
