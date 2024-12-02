import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { exec } from 'child_process';
import Debug from 'debug';
const debug = Debug('next-api-worker');

let port = (process.env.PORT) ? parseInt(process.env.PORT) : 4000;
let port_worker = (process.env.PORT_WORKER) ? parseInt(process.env.PORT_WORKER) : 8787;
let port_nextjs = (process.env.PORT_NEXTJS) ? parseInt(process.env.PORT_NEXTJS) : 3000;
let host_worker = (process.env.HOST_WORKER) ? process.env.HOST_WORKER : 'http://127.0.0.1';
let host_nextjs = (process.env.HOST_NEXTJS) ? process.env.HOST_NEXTJS : 'http://127.0.0.1';
let path_worker = (process.env.PATH_WORKER) ? process.env.PATH_WORKER : './worker';
let path_nextjs = (process.env.PATH_NEXTJS) ? process.env.PATH_NEXTJS : './nextjs';

let childWorker: any;
let childNextjs: any;


const debugObject = {
    info: (e: any) => {
        debug(e);
    }, 
    error: (e: any) => {
        debug(e);
    }
};

const startServer = () => {
    const app = express();

    const proxyAPI = createProxyMiddleware({
        target: `${host_worker}:${port_worker}/api`,
        changeOrigin: true,
        logger: debugObject
    });

    const proxyNextjs = createProxyMiddleware({
        target: `${host_nextjs}:${port_nextjs}`,
        ws: true,
        logger: debugObject
    });

    app.use('/api', proxyAPI);
    app.use('/', proxyNextjs);
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

const startWorker = () => {
    childWorker = exec(`cd ${path_worker} && yarn run dev --port ${port_worker}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

const startNextjs = () => {
    childNextjs = exec(`cd ${path_nextjs} && PORT=${port_nextjs} yarn run dev`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

const beforEnd = () => {
    console.log('Ending workers and nextjs')
    childWorker.kill();
    childNextjs.kill();
}

const end = () => {
    beforEnd();
    console.log('Ending processes');
    process.exit();
}

const manageArguments = () => {
    // controle agruments 
    // -p 4000 -pw 8787 -pn 3000 -hw 'http://127.0.0.1' -hn 'http://127.0.0.1' -dw '../worker' -dn '../client'
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-p') {
            port = parseInt(args[i + 1]);
        } else
        if (args[i] === '-pw') {
            port_worker = parseInt(args[i + 1]);
        } else if (args[i] === '-pn') {
            port_nextjs = parseInt(args[i + 1]);
        } else if (args[i] === '-hw') {
            host_worker = args[i + 1];
        } else if (args[i] === '-hn') {
            host_nextjs = args[i + 1];
        } else if (args[i] === '-dw') {
            path_worker = args[i + 1];
        } else if (args[i] === '-dn') {
            path_nextjs = args[i + 1];
        }
    } 
}


const start = () => {

    // Handle exit
    process.on('beforeExit', end);
    process.on('SIGINT',  end);
    process.on('SIGTERM', end);

    // Poder definer tot per parametres a la crida.
    manageArguments();

    startNextjs();
    startWorker();
    startServer();
}

start();