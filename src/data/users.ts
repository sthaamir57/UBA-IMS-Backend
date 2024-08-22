import { PostDto } from "../dtos/Post.dto";

export let posts: PostDto[] = [
  { id: 1, title: "Post one" },
  { id: 2, title: "Post two" },
  { id: 3, title: "Post three" },
  { id: 4, title: "Post four" },
];


export const getPosts = (): PostDto[] => posts;

export const findPostById = (id: number): PostDto | undefined => {
  return posts.find(post => post.id === id);
};

export const deletePostById = (id: number): PostDto[] => {
  posts = posts.filter(post => post.id !== id);
  return posts;
};