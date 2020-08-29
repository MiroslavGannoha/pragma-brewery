import express from 'express';
import beersDBData from '../db/beers.json';
import config from '../config';
import fetch from 'node-fetch';

const router = express.Router();
router.get('/', function (req, res) {
    res.send(beersDBData);
});

router.get('/temperature?:ids', function (req, res) {
    if (!req.query.ids) {
        res.status(400).json({
            message: 'Beer ids parameter not set!',
        });

        return;
    }
    const beersIds = req.query.ids as string;
    const beerTempPromises = beersIds
        .split(',')
        .map((id) =>
            fetch(config.tempServiceURL + '/' + id).then((res) => res.json())
        );

    // @ts-ignore (allSettled is missing in types lib)
    Promise.allSettled(beerTempPromises).then((data) => res.send(data));
});

export default router;
