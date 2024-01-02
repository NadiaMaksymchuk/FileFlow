import { Response } from '../interfaces/response';

export default (res: Response) => {
  res.send = (statusCode, data) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    const responseBody = JSON.stringify(data);
    res.write(responseBody);

    res.end();
  };
};
