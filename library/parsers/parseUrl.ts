import { Request } from '../interfaces/request';
  
  export default (baseUrl: string) => (req: Request) => {
    const parsedUrl = new URL(req.url, baseUrl);
    const params: Record<string, string> = {};
  
    parsedUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  
    req.pathName = parsedUrl.pathname;
    req.params = params;
  };
  