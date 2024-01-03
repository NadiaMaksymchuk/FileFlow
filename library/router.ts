import { HttpMethod } from "./types/httpMethod";

class Router {
    private endpoints: { [path: string]: { [method in HttpMethod]?: Function } } = {};

    request(method: HttpMethod = "GET", path: string, handler: Function, middleware?: Function[]): void {
        if (!this.endpoints[path]) {
            this.endpoints[path] = {};
        }

        const endpoint = this.endpoints[path];

        if (endpoint[method]) {
            throw new Error(`[${method}] to the address ${path} already exists`);
        }
        const finalHandler = async (req: any, res: any) => {
            try {
                if (middleware) {
                    for (const mw of middleware) {
                        await mw(req, res);
                    }
                }

                handler(req, res);
            } catch (error) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        };

        endpoint[method] = finalHandler;
    }

    get(path: string, handler: Function, middleware?: Function[]): void {
        this.request("GET", path, handler, middleware);
    }

    post(path: string, handler: Function, middleware?: Function[]): void {
        this.request("POST", path, handler, middleware);
    }

    put(path: string, handler: Function, middleware?: Function[]): void {
        this.request("PUT", path, handler, middleware);
    }

    delete(path: string, handler: Function, middleware?: Function[]): void {
        this.request("DELETE", path, handler, middleware);
    }
}

export default Router;
