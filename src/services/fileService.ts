import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import ApiResponse from '../utils/apiResponce';
import { HttpStatusCode } from '../enums/httpStatusCode';
import { currentUser } from '../middleware/authMiddleware';

export class FileService {
    async upload(requestData: any): Promise<ApiResponse<string>> {
        const temp: string = path.resolve(os.tmpdir(), 'temp' + Math.floor(Math.random() * 10));

        await fs.promises.writeFile(temp, requestData);

        const uploadFolder = await this.createFolder();

        const reader = await fs.promises.readFile(temp);

        const filenameWithoutExtension = reader.slice(
            reader.indexOf("filename=\"") + "filename=\"".length,
            reader.indexOf("\"\r\nContent-Type")
        ).toString();
        
        const timestampedFilename = this.createUniqueFileUrl(filenameWithoutExtension);

        const boundary = reader.slice(0, reader.indexOf('\r\n'));

        const content = reader.slice(
            reader.indexOf('\r\n\r\n') + '\r\n\r\n'.length,
            reader.lastIndexOf(boundary)
        );

        const filePath = path.join(uploadFolder, timestampedFilename);

        await fs.promises.writeFile(filePath, content);

        await fs.promises.unlink(temp);

        const fileUrl = `${process.env.BASE_URL}/${timestampedFilename}`;

        return new ApiResponse(HttpStatusCode.Created, fileUrl, "Uploaded!");
    }

    private createUniqueFileUrl(filenameWithoutExtension: string): string {
        const currentDate = new Date();
        const fileExtension = path.extname(filenameWithoutExtension);
        
        return `${currentUser.id}_${filenameWithoutExtension.split('.')[0]}_${currentDate.getTime()}${fileExtension}`;
    }

    private async createFolder() {
        const uploadFolder = path.resolve(__dirname, '../../uploads');

        await fs.promises.mkdir(uploadFolder, { recursive: true });

        return uploadFolder;
    }
}