import express, { Request, Response } from "express";
import {posts} from "../data/users";
import { PostDto } from "../dtos/Post.dto.js";
import Joi from "joi";

// Joi schema for post validation
const postSchema = Joi.object({
    title: Joi.string().min(6).required(),
  });

export const createPost = (req: Request, res: Response) => {
    const { error } = postSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
  
    const newPost: PostDto = {
      id: posts.length + 1,
      title: req.body.title,
    };
  
    posts.push(newPost);
    res.status(201).json(posts);
  }