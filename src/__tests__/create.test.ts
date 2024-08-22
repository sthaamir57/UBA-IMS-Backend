import { Request, Response } from "express";
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { createPost } from "../handlers/createPost"; // Adjust the path according to your file structure
import { posts } from "../data/users"; // Adjust the path according to your file structure

// Mock request and response
const mockRequest = (body: object) => {
  return {
    body,
  } as Partial<Request>;
};

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as unknown as (code: number) => Response;
  res.json = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
  return res;
};

describe("createPost", () => {
  beforeEach(() => {
    // Reset posts array to original state before each test
    posts.length = 0;
    posts.push(
      { id: 1, title: "Post one" },
      { id: 2, title: "Post two" },
      { id: 3, title: "Post three" },
      { id: 4, title: "Post four" }
    );
  });

  test("should create a new post with valid data", () => {
    const req = mockRequest({ title: "New Post" }) as Request;
    const res = mockResponse() as Response;

    createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, title: "Post one" },
      { id: 2, title: "Post two" },
      { id: 3, title: "Post three" },
      { id: 4, title: "Post four" },
      { id: 5, title: "New Post" }
    ]);
  });

  test("should return 400 if title is too short", () => {
    const req = mockRequest({ title: "Short" }) as Request;
    const res = mockResponse() as Response;

    createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: '"title" length must be at least 6 characters long' });
  });

  test("should return 400 if title is missing", () => {
    const req = mockRequest({}) as Request;
    const res = mockResponse() as Response;

    createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: '"title" is required' });
  });
});
