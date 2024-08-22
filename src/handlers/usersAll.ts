import express, { Request, Response } from "express";
import {posts} from "../data/users";

export const getUserFromId = (req: Request, res: Response) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
  
    if (!post) {
      return res.status(404).json({ msg: `The post with id of ${id} was not found` });
    }
  
    res.status(200).json(post);
  }