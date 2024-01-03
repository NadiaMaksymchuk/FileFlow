export interface Request {
    rawHeaders: string[];
    pathName: string;
    params: Record<string, string>;
    url: string;
    body: string;
  }