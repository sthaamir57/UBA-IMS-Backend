import { Request, Response } from 'express';
import * as usersData from '../data/users';
import { deletePost } from '../handlers/deletePost';

jest.mock('../data/users');

describe('deletePost', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRequest = {
      params: { id: '1' }
    };
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a post and return updated posts when post exists', () => {
    const mockPost = { id: 1, title: 'Test Post' };
    const mockUpdatedPosts = [{ id: 2, title: 'Another Post' }];

    (usersData.findPostById as jest.Mock).mockReturnValue(mockPost);
    (usersData.deletePostById as jest.Mock).mockReturnValue(mockUpdatedPosts);

    deletePost(mockRequest as Request, mockResponse as Response);

    expect(usersData.findPostById).toHaveBeenCalledWith(1);
    expect(usersData.deletePostById).toHaveBeenCalledWith(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockUpdatedPosts);
  });

  it('should return 404 when post does not exist', () => {
    (usersData.findPostById as jest.Mock).mockReturnValue(null);

    deletePost(mockRequest as Request, mockResponse as Response);

    expect(usersData.findPostById).toHaveBeenCalledWith(1);
    expect(usersData.deletePostById).not.toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ msg: 'The post with id of 1 was not found' });
  });
});