import ApiResponse from '../utils/apiResponce';
import * as dotenv from 'dotenv';
import { AuthDto } from '../dtos/auth/authDto';
import { FirebaseServiceInterface } from './interfaces/firebaseServiceInterface';
import { makeRequest } from '../utils/requestUtil';

dotenv.config();

export class FirebaseService implements FirebaseServiceInterface{
    private firebaseApiKey = process.env.FIREBASE_API_KEY;
    private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.firebaseApiKey}`;
    private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;
    
    async signUp(userCredentialDto: AuthDto): Promise<ApiResponse<string>> {
      const requestData = {
        ...userCredentialDto,
        returnSecureToken: true,
      };
  
      return makeRequest(this.signUpUrl, requestData);
    }
  
    async signIn(userCredentialDto: AuthDto): Promise<ApiResponse<string>> {
      const requestData = {
        ...userCredentialDto,
        returnSecureToken: true,
      };
  
      return makeRequest(this.signInUrl, requestData);
    }
}