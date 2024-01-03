import { Response } from '../interfaces/response';
import { Request } from '../interfaces/request'

export default (req: Request, res: Response) => {
  res.send = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    const responseBody = JSON.stringify(data);
    res.write(responseBody);

    res.end();
  };
};
