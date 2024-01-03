import { ServerResponse } from "http";
import ApiResponse from "../../src/utils/apiResponce";

export interface Response extends ServerResponse {
    send: <T>(statusCode: number, data: ApiResponse<T>) => void;
}