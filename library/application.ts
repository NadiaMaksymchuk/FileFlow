import * as http from 'http';
import { EventEmitter } from 'events';
import { HttpMethod } from './types/httpMethod';


class Application {
    private emitter: EventEmitter;
    private server: http.Server;
    private middlewares: Function[];

    constructor() {
        this.emitter = new EventEmitter();
        this.server = this.createServer();
        this.middlewares = [];
    }

    use(middleware: Function): void {
        this.middlewares.push(middleware);
    }

    listen(port: number, callback?: () => void): void {
        this.server.listen(port, callback);
    }

    addRouter(router: any): void {
        Object.keys(router.endpoints).forEach(path => {
            const endpoint = router.endpoints[path];
            Object.keys(endpoint).forEach((method: HttpMethod) => {
                this.emitter.on(this.getRouteMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res);
                });
            });
        });
    }

    private createServer(): http.Server {
        return http.createServer((req, res) => {
            let body = '';

            this.connectGlobalCatchingExeptions(res);

            req.on('data', (chunk) => {
                body += chunk;
            });

            req.on('end', () => {
                if (body) {
                    (req as any).body = JSON.parse(body);
                }

                this.middlewares.forEach(middleware => middleware(req, res));

                const emitted = this.emitter.emit(this.getRouteMask(req.url!, req.method as HttpMethod), req, res);

                if (!emitted) {
                    res.end();
                }
            });
        });
    }

    private getRouteMask(path: string, method: HttpMethod): string {
        return `[${path}]:[${method}]`;
    }

    private connectGlobalCatchingExeptions(res: http.ServerResponse<http.IncomingMessage>) {
        process.on('uncaughtException', function (err) {
            console.log('UNCAUGHT EXCEPTION - keeping process alive:', err); 

            res.statusCode = 500;

            res.write(err.message);

            res.end();
        });
    }
}

export default Application;