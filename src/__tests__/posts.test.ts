import { Request, Response } from "express";
import {describe, expect, test} from '@jest/globals';
import { getUserFromId } from "../handlers/usersAll";

// Mock request and response
const mockRequest = (params: object) => {
  return {
    params,
  } as Partial<Request>;
};

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getUserFromId", () => {
  test("should return the post if found", () => {
    const req = mockRequest({ id: "1" }) as Request;
    const res = mockResponse() as Response;

    getUserFromId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, title: "Post one" });
  });

  test("should return 404 if the post is not found", () => {
    const req = mockRequest({ id: "99" }) as Request;
    const res = mockResponse() as Response;

    getUserFromId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: `The post with id of 99 was not found`,
    });
  });
});
