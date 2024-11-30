import proxy from 'express-http-proxy';
import express from 'express';
const port = (process.env.PORT) ? parseInt(process.env.PORT) : 4000;
const port_worker = (process.env.PORT) ? parseInt(process.env.PORT) : 8787;
const port_nextjs = (process.env.PORT) ? parseInt(process.env.PORT) : 3000;


const app = express();
app.use('/api', proxy(`127.0.0.1:${port_worker}`, {
    proxyReqPathResolver: function (req) {
        // Remove / in final url
        return ('/api' + req.url).replace(/\/$/, "");
    }
}));

app.use('/', proxy(`127.0.0.1:${port_nextjs}`))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })