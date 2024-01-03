import * as https from 'https';
import ApiResponse from './apiResponce';
import { HttpStatusCode } from '../enums/httpStatusCode';
import { FirebaseRequestDto } from '../dtos/auth/firebaseRequestDto';


export async function makeRequest(url: string, requestData: FirebaseRequestDto): Promise<ApiResponse<string>> {
    const data = JSON.stringify(requestData);

    const options: https.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    return new Promise<ApiResponse<string>>((resolve) => {
      const req = https.request(url, options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === HttpStatusCode.OK) {
            const { idToken } = JSON.parse(responseData);

            const response = new ApiResponse(HttpStatusCode.OK, idToken, `User ${url.includes('signUp') ? 'signed up' : 'signed in'} successfully!`);
            resolve(response);
          }

          if (res.statusCode !== HttpStatusCode.OK) { 
            const response = new ApiResponse(HttpStatusCode.BadRequest, null, JSON.parse(responseData)?.error?.message);
            resolve(response);
          }
        });
      });

      req.write(data);
      req.end();
    });
  }