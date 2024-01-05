import { Response } from '../interfaces/response';
import { Request } from '../interfaces/request';

export default (req: Request, res: Response) => {
  res.setHeader('Content-Disposition', `attachment; filename=${req.params['url']}`);

  res.send = (data) => {
    res.writeHead(data.status);

    res.end(data.data, 'binary');
  };
};