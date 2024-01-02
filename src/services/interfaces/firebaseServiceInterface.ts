import { AuthDto } from "../../dtos/auth/authDto";
import { FirebaseAuthResponse } from "../../dtos/auth/firebaseAuthResponce";
import ApiResponse from "../../utils/apiResponce";

export interface FirebaseServiceInterface {
    signUp(userCredentialDto: AuthDto): Promise<ApiResponse<FirebaseAuthResponse>>;
    signIn(userCredentialDto: AuthDto): Promise<ApiResponse<FirebaseAuthResponse>>;
}