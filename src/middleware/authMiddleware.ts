import { HttpStatusCode } from '../enums/httpStatusCode';
import { Request } from '../../library/interfaces/request';
import { Response } from '../../library/interfaces/response';
import { createVerify } from 'crypto';

import * as https from 'https';
import { UserDto } from '../dtos/user/userDto';
import ApiResponse from '../utils/apiResponce';

export let currentUser: UserDto;

const firebaseConfig = {
  projectId: 'your-firebase-project-id',
};

const verifyFirebaseToken = async (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Retrieve the public key from Firebase
    const publicKeyUrl = `https://www.googleapis.com/robot/v1/metadata/x509/firebase-auth@${firebaseConfig.projectId}.iam.gserviceaccount.com`;
    
    https.get(publicKeyUrl, (res) => {
      let publicKeyData = '';
      
      res.on('data', (chunk) => {
        publicKeyData += chunk;
      });

      res.on('end', () => {
        try {
          const publicKeys = JSON.parse(publicKeyData);
          const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

          // Verify the issuer and audience
          if (
            decodedToken.iss === `https://securetoken.google.com/${firebaseConfig.projectId}` &&
            decodedToken.aud === firebaseConfig.projectId
          ) {
            const keyId = decodedToken.header.kid;
            const publicKey = publicKeys[keyId];

            // Verify the signature (Note: This is a simplified example, for production, use a library like jsonwebtoken)
            const signature = Buffer.from(token.split('.')[2], 'base64');
            const verified = createVerify('sha256')
            .update(token.split('.')[0] + '.' + token.split('.')[1])
            .verify(publicKey, String(signature), 'base64');

            if (verified) {
              resolve(decodedToken);
            } else {
              reject(new Error('Invalid signature'));
            }
          } else {
            reject(new Error('Invalid issuer or audience'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.params['Authorization']?.replace('Bearer ', '');

  if (!token) {
    const response = new ApiResponse(HttpStatusCode.Unauthorized, null, "Unauthorized - Missing token");
    return res.send(response.status, response);
  }

  try {
    const decodedToken = await verifyFirebaseToken(token);

    currentUser = decodedToken;

  } catch (error) {
    console.error('Firebase Authentication Error:', error.message);

    res.send(HttpStatusCode.Unauthorized, null);
  }
};