import { FirebaseService } from "../services/firebaseService";
import { Request } from '../../library/interfaces/request';
import { Response } from '../../library/interfaces/response';
import { AuthDto } from "../dtos/auth/authDto";
import { FirebaseAuthResponse } from "src/dtos/auth/firebaseAuthResponce";

export class AuthController {
    private service = new FirebaseService();

    public signIn = async (req: Request, res: Response) => {
        const response = await this.service.signIn(req.body as unknown as AuthDto);

        res.send(response.status, response);
    }

    public signUp = async (req: Request, res: Response) => {
        const response = await this.service.signUp(req.body as unknown as AuthDto);

        res.send(response.status, response);
    }
}