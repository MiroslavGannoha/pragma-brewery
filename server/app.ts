import express from 'express';
import path from 'path';
import logger from 'morgan';
import apiRouter from './api';

const app = express();
const distDir = path.join(__dirname, '../dist');

app.use(logger('dev'));
app.use(express.static(distDir));

app.use('/api', apiRouter);

app.get(/^\/.*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

export default app;
