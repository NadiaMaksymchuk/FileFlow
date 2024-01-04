import * as http from 'http';
import { EventEmitter } from 'events';
import { HttpMethod } from './types/httpMethod';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';


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
                this.emitter.on(this.getRouteMask(path, method), async (req, res) => {
                    const handler = endpoint[method];
                    await handler(req, res);
                });
            });
        });
    }

    private createServer(): http.Server {
        return http.createServer((req, res) => {
            const chunks: Buffer[] = [];
            let body = '';

            this.connectGlobalCatchingExeptions(res);

            if(req.rawHeaders[req.rawHeaders.indexOf('Content-Type') + 1].includes('multipart/form-data')) {
                req.on('data', (chunk) => {
                    chunks.push(chunk);
                });
            }

            if (req.rawHeaders[req.rawHeaders.indexOf('Content-Type') + 1].includes('application/json')) {
                req.on('data', (data) => {
                    body += data;
                });
            }

            req.on('end', () => {
                if (chunks) {
                    (req as any).body = chunks;
                }

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

    private parseBody(req: http.IncomingMessage) {
        const chunks: Buffer[] = [];
        let body = '';

        if(req.rawHeaders[req.rawHeaders.indexOf('Content-Type') + 1].includes('multipart/form-data')) {
            req.on('data', (chunk) => {
                chunks.push(chunk);
            });
        }

        if (req.rawHeaders[req.rawHeaders.indexOf('Content-Type') + 1].includes('application/json')) {
            req.on('data', (data) => {
                body += data;
            });
        }

        return chunks || body;
    }
}

export default Application;
