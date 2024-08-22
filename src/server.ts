// const express = require("express");
// const posts = require("./routes/posts");
import cors from "cors";
import express, { Request, Response } from "express";
import "reflect-metadata";
import AppDataSourcee from "src/db/datasource/dataSource";
import { createUser } from "src/handlers/createUser";
import auth from "src/routes/auth";
import user from "src/routes/user";

const PORT = 3000;
const app = express();

AppDataSourcee.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use(cors());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
// app.use("/api/posts", posts);

app.post("/signup", async (req: Request, res: Response) => {
  const { username, email, name, password, roleId } = req.body;

  console.log(req.body);

  try {
    await createUser(username, email, name, password, roleId);
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/auth", auth);
app.use("/users", user);

// app.get("/", async (req: Request, res: Response) => {
//   try {
//     const userRepo = AppDataSourcee.getRepository(User);
//     const users = await userRepo.find(); // Fetch all users from the database
//     res.json(users); // Send the fetched users as a JSON response
//   } catch (error) {
//     res.status(500).send("Error fetching users");
//   }
// });

app.listen(PORT, () => console.log(`Server is running on port 3000`));
