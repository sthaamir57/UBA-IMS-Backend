import { Request, Response } from "express";
import { deletePostById, findPostById } from "../data/users";

// export const deletePost = (req: Request, res: Response) => {
//     console.log(req.params.id);
//     const id = parseInt(req.params.id);
//     const post = posts.find((post) => post.id === id);

//     if (!post) {
//       return res.status(404).json({ msg: `The post with id of ${id} was not found` });
//     }

//     posts = posts.filter((post) => post.id !== id);
//     res.status(200).json(posts);
//   }

export const deletePost = (req: Request, res: Response) => {
  console.log(req.params.id);
  const id = parseInt(req.params.id);
  const post = findPostById(id);

  if (!post) {
    return res
      .status(404)
      .json({ msg: `The post with id of ${id} was not found` });
  }

  const updatedPosts = deletePostById(id);
  res.status(200).json(updatedPosts);
};
