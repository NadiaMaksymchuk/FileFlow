import { HttpMethod } from "./types/httpMethod";

class Router {
    private endpoints: { [path: string]: { [method in HttpMethod]?: Function } } = {};

    request(method: HttpMethod = "GET", path: string, handler: Function): void {
        if (!this.endpoints[path]) {
            this.endpoints[path] = {};
        }

        const endpoint = this.endpoints[path];

        if (endpoint[method]) {
            throw new Error(`[${method}] по адресу ${path} уже существует`);
        }

        endpoint[method] = handler;
    }

    get(path: string, handler: Function): void {
        this.request("GET", path, handler);
    }

    post(path: string, handler: Function): void {
        this.request("POST", path, handler);
    }

    put(path: string, handler: Function): void {
        this.request("PUT", path, handler);
    }

    delete(path: string, handler: Function): void {
        this.request("DELETE", path, handler);
    }
}

export default Router;
