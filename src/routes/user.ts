// src/routes/user.ts
import * as bcrypt from "bcryptjs";
import { Router } from "express";
import { jwtDecode } from "jwt-decode";
import nodemailer from "nodemailer";
import { User } from "src/db/entities/User.entity";
import { authenticateJWT } from "src/middleware/auth";
import { authorizePermission } from "src/middleware/authorize";
import AppDataSource from "../db/datasource/dataSource";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  authorizePermission(["read_users"]),
  async (req, res) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      where: { deleted: false },
      relations: ["role"],
    });
    res.json(users);
  }
);

// transporter for sending emails
// TODO: fix me
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS,
  },
});

router.post(
  "/",
  authenticateJWT,
  authorizePermission(["create_users"]),
  async (req, res) => {
    const { username, password, roleId, email, name } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.username = username;
    user.email = email;
    user.name = name;
    user.role = { id: roleId } as any;

    console.log(user);

    // Hash the password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);

    try {
      // Save the user
      await userRepository.save(user);

      // Send email with credentials
      await transporter.sendMail({
        from: "amir.shrestha0057@gmail.com",
        to: email,
        subject: "Your Account Credentials",
        text: `Hello ${name},\n\nYour account has been created. Here are your login credentials:\nUsername: ${username}\nPassword: ${password}\n\nPlease log in using these credentials at our login page.`,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Failed to create user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);

router.delete(
  "/:id",
  authenticateJWT,
  authorizePermission(["delete_users"]),
  async (req, res) => {
    const userId = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.deleted = true; // Mark user as deleted
    await userRepository.save(user);

    res.status(200).json({ message: "User deleted successfully" });
  }
);

const getUserIdFromToken = (token: string): number | null => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

router.get("/me", authenticateJWT, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId, deleted: false },
    relations: ["role"],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Route to edit current user data
router.put("/me", authenticateJWT, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { name, username, email, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId, deleted: false },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;
  if (password) await user.setPassword(password);

  await userRepository.save(user);
  res.json(user);
});

// Route to edit any user data (admin only)
router.put(
  "/:id",
  authenticateJWT,
  authorizePermission(["update_users"]),
  async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, username, email, roleId } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId, deleted: false },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (roleId) user.role = { id: roleId } as any;

    await userRepository.save(user);
    res.json(user);
  }
);

// Route to get a user by ID (admin only)
router.get(
  "/:id",
  authenticateJWT,
  authorizePermission(["read_users"]),
  async (req, res) => {
    const userId = parseInt(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId, deleted: false },
      relations: ["role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  }
);

// Add more CRUD operations with similar protection

export default router;
