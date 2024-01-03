import { Response } from '../../library/interfaces/response';
import { Request } from '../../library/interfaces/request'
import { HttpStatusCode } from '../enums/httpStatusCode';
import ApiResponse from '../utils/apiResponce';
import { AuthDto } from '../dtos/auth/authDto';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

function authValidateMiddleware(req: Request, res: Response) {
  const { email, password } = req.body as AuthDto;

  if (!emailRegex.test(email)) {
    const response = new ApiResponse(HttpStatusCode.BadRequest, null, "Invalid email");
    return res.send(response);
  }

  if (!passwordRegex.test(password)) {
    const response = new ApiResponse(HttpStatusCode.BadRequest, null, "Invalid password. It must contain at least 8 characters, one uppercase letter, and one digit.");
    return res.send(response);
  }
}

export default authValidateMiddleware;