import express, { Request, Response } from "express";
import Joi from "joi";
import {posts} from "../data/users";

const postSchema = Joi.object({
    title: Joi.string().min(6).required(),
  });

export const updatePost = (req: Request, res: Response) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);

    if (!post) {
      return res.status(404).json({ msg: `The post with id of ${id} was not found` });
    }

    const { error } = postSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    post.title = req.body.title;
    res.status(200).json(posts);
  }

