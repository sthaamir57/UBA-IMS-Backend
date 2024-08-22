// src/middleware/auth.ts
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import AppDataSource from "../db/datasource/dataSource";
import { User } from "../db/entities/User.entity";

// Define a custom interface for the Request object with user
interface AuthenticatedRequest extends Request {
  user?: User;
}

// Define the structure of your JWT payload
interface JwtPayload {
  id: number; // Assuming the ID is a number, adjust if it's a different type
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decodedToken = jwt.verify(token, "your_jwt_secret") as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decodedToken.id },
      relations: ["role", "role.permissions"],
    });

    if (!user) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
