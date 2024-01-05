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

        const uploadFolder = await this.getFolder();

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

    getMyAllFilles() {

    }

    async deleteMyFile(fileUrl: string): Promise<ApiResponse<null>> {
        const userId = fileUrl.split('_')[0];

        if(currentUser.id !== userId) {
            return new ApiResponse(HttpStatusCode.Forbidden, null, "Permission denied");
        }

        const filePath = path.join(await this.getFolder(), fileUrl);

        try {
            await fs.promises.unlink(filePath);
        }
        catch(error) {
            if (error.code === 'ENOENT') {
                return new ApiResponse(HttpStatusCode.NotFound, null, "Not found");
            }
        }

        return new ApiResponse(HttpStatusCode.NoContent, null, "Deleted");
    }

    async downloadMyFile(fileUrl: string) {
        // const filePath = path.join(await this.getFolder(), fileUrl);

        // fs.readFile(filePath, (err, data) => {
        //       res.setHeader('Content-Disposition', `attachment; filename=${fileUrl}`);
        //       res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        //       res.end(data);
        //   });
        // }
    }

    private createUniqueFileUrl(filenameWithoutExtension: string): string {
        const currentDate = new Date();
        const fileExtension = path.extname(filenameWithoutExtension);
        
        return `${currentUser.id}_${filenameWithoutExtension.split('.')[0]}_${currentDate.getTime()}${fileExtension}`;
    }

    private async getFolder() {
        const uploadFolder = path.resolve(__dirname, '../../uploads');

        await fs.promises.mkdir(uploadFolder, { recursive: true });

        return uploadFolder;
    }
}