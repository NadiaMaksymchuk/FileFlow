export interface Request {
    pathName: string;
    params: Record<string, string>;
    url: string;
    body: string;
  }