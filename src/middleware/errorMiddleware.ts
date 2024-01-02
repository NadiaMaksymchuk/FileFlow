import { HttpStatusCode } from "../enums/httpStatusCode";
import { Response } from "../../library/interfaces/response";


export const errorMiddleware = (error: Error, res: Response) => {
    res.send(HttpStatusCode.InternalServerError, error);
}