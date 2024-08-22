import { Request, Response } from "express";
import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { updatePost } from "../handlers/updatePost"; // Adjust the path according to your file structure
import { posts } from "../data/users"; // Adjust the path according to your file structure

// Mock request and response
const mockRequest = (params: object, body: object) => {
  return {
    params,
    body,
  } as Partial<Request>;
};

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as unknown as (code: number) => Response;
  res.json = jest.fn().mockReturnValue(res) as unknown as (body: any) => Response;
  return res;
};

describe("updatePost", () => {
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

  test("should update a post with valid data", () => {
    const req = mockRequest({ id: "1" }, { title: "Updated Post One" }) as Request;
    const res = mockResponse() as Response;

    updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, title: "Updated Post One" },
      { id: 2, title: "Post two" },
      { id: 3, title: "Post three" },
      { id: 4, title: "Post four" }
    ]);
  });

  test("should return 404 if the post is not found", () => {
    const req = mockRequest({ id: "99" }, { title: "Nonexistent Post" }) as Request;
    const res = mockResponse() as Response;

    updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: `The post with id of 99 was not found` });
  });

  test("should return 400 if title is too short", () => {
    const req = mockRequest({ id: "1" }, { title: "Short" }) as Request;
    const res = mockResponse() as Response;

    updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: '"title" length must be at least 6 characters long' });
  });

  test("should return 400 if title is missing", () => {
    const req = mockRequest({ id: "1" }, {}) as Request;
    const res = mockResponse() as Response;

    updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: '"title" is required' });
  });
});
