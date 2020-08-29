import express from 'express';
import beersApi from './beers';

const router = express.Router();

router.use('/beers', beersApi);
router.use((req, res) => {
    res.status(404).json({
        message: 'Not found',
    });
});

export default router;
