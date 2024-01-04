import { Response } from '../../library/interfaces/response';
import { Request } from '../../library/interfaces/request';
import { FileService } from '../services/fileService';

export class FileController {
    private fileService = new FileService();

    handleFileUpload = async (req: Request, res: Response) => {
        const response = await this.fileService.upload(req.body);
        res.send(response);
    }
};