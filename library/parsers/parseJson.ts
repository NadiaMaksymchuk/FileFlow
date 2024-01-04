import { Response } from '../interfaces/response';
import { Request } from '../interfaces/request';

export default (req: Request, res: Response) => {
  res.send = (data) => {
    res.writeHead(data.status, {
      'Content-Type': 'application/json',
    });

    const responseBody = JSON.stringify(data);
    res.write(responseBody);

    res.end();
  };
};
