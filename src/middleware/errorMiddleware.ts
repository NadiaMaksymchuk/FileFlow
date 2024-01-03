import { HttpStatusCode } from "../enums/httpStatusCode";
import { Response } from "../../library/interfaces/response";
import { Request } from "../../library/interfaces/request";


export default (req: Request, res: Response, error: Error) => {
    res.send(HttpStatusCode.InternalServerError, error);
}