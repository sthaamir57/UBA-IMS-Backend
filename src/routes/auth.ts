// src/routes/auth.ts
import { Router } from "express";
import * as jwt from "jsonwebtoken";
import AppDataSource from "../db/datasource/dataSource";
import { User } from "../db/entities/User.entity";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { username, deleted: false },
    relations: ["role", "role.permissions"],
  });

  console.log(JSON.stringify(user, null, 2));

  if (user && (await user.checkPassword(password))) {
    console.log(user.checkPassword(password));
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name,
        permissions: user.role.permissions.map((p) => p.name),
      },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Endpoint to check if username or email exists
router.get("/check-availability", async (req, res) => {
  const { username, email } = req.query;

  if (!username && !email) {
    return res.status(400).json({ message: "Username or email required" });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    console.log(
      await userRepository.findOne({ where: { username: String(username) } })
    );

    const usernameExists = username
      ? await userRepository.findOne({ where: { username: String(username) } })
      : false;
    console.log("heloo : " + usernameExists);

    const emailExists = email
      ? await userRepository.findOne({ where: { email: String(email) } })
      : false;

    res.json({
      usernameExists: !!usernameExists,
      emailExists: !!emailExists,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
