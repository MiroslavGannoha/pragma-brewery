import express from 'express';
import path from 'path';
import logger from 'morgan';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();
const distDir = path.join(__dirname, '../dist');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(distDir));
app.get(/^\/.*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
