import { AuthDto } from "../../dtos/auth/authDto";
import ApiResponse from "../../utils/apiResponce";

export interface FirebaseServiceInterface {
    signUp(userCredentialDto: AuthDto): Promise<ApiResponse<string>>;
    signIn(userCredentialDto: AuthDto): Promise<ApiResponse<string>>;
}