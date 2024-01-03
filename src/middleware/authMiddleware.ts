import { HttpStatusCode } from '../enums/httpStatusCode';
import { Request } from '../../library/interfaces/request';
import { Response } from '../../library/interfaces/response';
import { UserDto } from '../dtos/user/userDto';
import ApiResponse from '../utils/apiResponce';

export let currentUser: UserDto;

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.rawHeaders[1]?.replace('Bearer ', '');

  if (!token) {
    const response = new ApiResponse(HttpStatusCode.Unauthorized, null, "Unauthorized - Missing token");
    return res.send(response.status, response);
  }

  try {
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    const currentTimestamp = Math.floor(Date.now() / 1000); 


    if (currentTimestamp > decodedToken.exp) {
      const response = new ApiResponse(HttpStatusCode.Unauthorized, null, "Unauthorized - Expired token");
      return res.send(response.status, response);
    }
  } catch (error) {
    res.send(HttpStatusCode.Unauthorized, error.message);
  }
};