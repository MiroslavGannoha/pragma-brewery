import express from 'express';
import beersDBData from '../db/beers.json';
import fetch from 'node-fetch';
import { IBeerPlain } from '../../src/app/stores/BeersStore/models';

const tempServiceURL = 'https://temperature-sensor-service.herokuapp.com/sensor';

const router = express.Router();
router.get('/', function (req, res) {
    res.send(beersDBData as IBeerPlain[]);
});

router.get('/temperature?:ids', function (req, res) {
    if (!req.query.ids) {
        res.status(400).json({
            message: 'Beer ids parameter not set!',
        });

        return;
    }
    const beersIds = req.query.ids as string;
    const beerTempPromises: Promise<{id: string; temperature: string}>[] = beersIds
        .split(',')
        .map((id) =>
            fetch(tempServiceURL + '/' + id).then((res) => res.json())
        );

    Promise.allSettled(beerTempPromises).then((result) => res.send(result));
});

export default router;
