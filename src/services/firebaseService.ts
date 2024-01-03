import * as https from 'https';
import { HttpStatusCode } from '../enums/httpStatusCode';
import ApiResponse from '../utils/apiResponce';
import * as dotenv from 'dotenv';
import { FirebaseAuthResponse } from '../dtos/auth/firebaseAuthResponce';
import { AuthDto } from '../dtos/auth/authDto';
import { FirebaseServiceInterface } from './interfaces/firebaseServiceInterface';

dotenv.config();

export class FirebaseService implements FirebaseServiceInterface{
    private firebaseApiKey = process.env.FIREBASE_API_KEY;
    private signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.firebaseApiKey}`;
    private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseApiKey}`;
    
    async signUp(userCredentialDto: AuthDto): Promise<ApiResponse<string>> {
        const requestData = JSON.stringify({
          email: userCredentialDto.email,
          password: userCredentialDto.password,
          returnSecureToken: true,
        });
      
        const options: https.RequestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      
        return new Promise<ApiResponse<string>>((resolve, reject) => {
          const req = https.request(this.signUpUrl, options, (res) => {
            let responseData = '';
      
            res.on('data', (chunk) => {
              responseData += chunk;
            });
      
            res.on('end', () => {
              if (res.statusCode === 200) {
                const {idToken} = JSON.parse(responseData) as Pick<FirebaseAuthResponse, keyof FirebaseAuthResponse>;

                const response = new ApiResponse(HttpStatusCode.OK, idToken, 'User signed up successfully!');
                resolve(response);
              }
            });
          });
      
          req.on('error', (error) => {
            const response = new ApiResponse(HttpStatusCode.BadRequest, null, error.message);
            reject(response);
          });
      
          req.write(requestData);
          req.end();
        });
      }

      async signIn(userCredentialDto: AuthDto): Promise<ApiResponse<string>> {
        const requestData = JSON.stringify({
          email: userCredentialDto.email,
          password: userCredentialDto.password,
          returnSecureToken: true,
        });
      
        const options: https.RequestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      
        return new Promise<ApiResponse<string>>((resolve, reject) => {
          const req = https.request(this.signInUrl, options, (res) => {
            let responseData = '';
      
            res.on('data', (chunk) => {
              responseData += chunk;
            });
      
            res.on('end', () => {
              if (res.statusCode === 200) {
                const { idToken } = JSON.parse(responseData) as Pick<FirebaseAuthResponse, keyof FirebaseAuthResponse>;

                const response = new ApiResponse(HttpStatusCode.OK, idToken, 'User signed in successfully!');
                resolve(response);
              }
            });
          });
      
          req.on('error', (error) => {
            const response = new ApiResponse(HttpStatusCode.BadRequest, null, error.message);
            reject(response);
          });
      
          req.write(requestData);
          req.end();
        });
      }
}