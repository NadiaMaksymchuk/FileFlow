import { ServerResponse } from "http";
import ApiResponse from "../../src/utils/apiResponce";

export interface Response extends ServerResponse {
    send: (statusCode: number, data: any) => void;
}