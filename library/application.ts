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
                this.emitter.on(this.getRouteMask(path, method), (req, res) => {
                    const handler = endpoint[method];
                    handler(req, res);
                });
            });
        });
    }

    private createServer(): http.Server {
        return http.createServer(async (req, res) => {
            let body = '';

            this.connectGlobalCatchingExeptions(res);

            req.on('data', (chunk) => {
                body += chunk;
            });
            if (req.url == '/fileupload') {
                await storeFile(req);
                res.end();
            }

            req.on('end', () => {
                // if (body) {
                //     (req as any).body = JSON.parse(body);
                // }



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

async function storeFile(req: any): Promise<void> {
    // Resolve path/to/temp/file
    const temp: string = path.resolve(os.tmpdir(), 'temp' + Math.floor(Math.random() * 10));

    // Create a promise to read data from the request
    const requestDataPromise = new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', (error: any) => reject(error));
    });

    try {
        // Read data from the request
        const requestData = await requestDataPromise;

        // Write data to the temporary file
        await fs.promises.writeFile(temp, requestData);

        // Read the temporary file
        const reader = await fs.promises.readFile(temp);

        // Extract filename and boundary
        const filename = reader.slice(reader.indexOf("filename=\"") + "filename=\"".length, reader.indexOf("\"\r\nContent-Type"));
        const boundary = reader.slice(0, reader.indexOf('\r\n'));

        // Extract content between boundaries
        const content = reader.slice(
            reader.indexOf('\r\n\r\n') + '\r\n\r\n'.length,
            reader.lastIndexOf(boundary)
        );

        // Write the real file
        await fs.promises.writeFile(filename.toString(), content);

        // Delete the temporary file
        await fs.promises.unlink(temp);
    } catch (error) {
        console.error('Error processing file:', error);
        // Handle error as needed
    }
}