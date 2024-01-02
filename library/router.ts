import { HttpMethod } from "./types/httpMethod";

class Router {
    private endpoints: { [path: string]: { [method in HttpMethod]?: { handler: Function, middlewares?: Function[] } } } = {};

    request(method: HttpMethod = "GET", path: string, handler: Function, middlewares?: Function[]): void {
        if (!this.endpoints[path]) {
            this.endpoints[path] = {};
        }

        const endpoint = this.endpoints[path];

        endpoint[method] = {
            handler,
            middlewares
        };
    }

    get(path: string, handler: Function, middlewares?: Function[]): void {
        this.request("GET", path, handler, middlewares);
    }

    post(path: string, handler: Function): void {
        this.request("POST", path, handler);
    }

    put(path: string, handler: Function, middlewares?: Function[]): void {
        this.request("PUT", path, handler, middlewares);
    }

    delete(path: string, handler: Function, middlewares?: Function[]): void {
        this.request("DELETE", path, handler, middlewares);
    }

    // handleRequest(method: HttpMethod, path: string, ...params: any[]): void {
    //     const endpoint = this.endpoints[path]?.[method];

    //     if (endpoint) {
    //         const { handler, middlewares } = endpoint;

    //         if (middlewares) {
    //             middlewares.forEach(middleware => middleware(...params));
    //         }

    //         handler(...params);
    //     } else {
    //         console.error(`Endpoint not found for ${method} ${path}`);
    //     }
    // }
}

export default Router;
