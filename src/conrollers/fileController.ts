import { Response } from '../../library/interfaces/response';
import { Request } from '../../library/interfaces/request';
import { FileService } from '../services/fileService';

export class FileController {
    private fileService = new FileService();

    handleFileUpload = async (req: Request, res: Response) => {
        const response = await this.fileService.upload(req.body);
        res.send(response);
    }

    getAllMyFiles = async (req: Request, res: Response) => {
    }

    deleteMyFile = async (req: Request, res: Response) => {
        const response = await this.fileService.deleteMyFile(req.params["url"]);
        res.send(response);
    }

    downloadMyFile = async (req: Request, res: Response) => {
        const response = await this.fileService.downloadMyFile(req.params["url"]);
        res.send(response);
    }
};