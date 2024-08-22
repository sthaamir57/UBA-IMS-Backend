import express, { Request, Response } from "express";
import Joi from "joi";
import { posts } from "../data/users";
import { getUserFromId } from "../handlers/usersAll";
import { PostDto } from "../dtos/Post.dto";
import { createPost } from "../handlers/createPost";
import { updatePost } from "../handlers/updatePost";
import { deletePost } from "../handlers/deletePost";

const router = express.Router();

// Joi schema for post validation
const postSchema = Joi.object({
  title: Joi.string().min(6).required(),
});

router.get("/", (req: Request, res: Response) => {
  res.json(posts);
});

router.get("/:id", getUserFromId);

// create new post
router.post("/", createPost);

// update a post
router.put("/:id", updatePost);

// delete post
router.delete("/:id", deletePost);

export default router;
