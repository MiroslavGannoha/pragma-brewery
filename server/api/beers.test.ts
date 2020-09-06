import app from '../app';
import request from 'supertest';

describe('Beers API', () => {
    it('responds with beers', async () => {
        const {statusCode, body} = await request(app).get('/api/beers');
        expect(statusCode).toEqual(200);
        expect(body.length).toBeGreaterThan(0);
        const firstBeer = body[0];
        expect(firstBeer).toHaveProperty('id');
        expect(firstBeer).toHaveProperty('type');
        expect(firstBeer).toHaveProperty('minTemperature');
        expect(firstBeer).toHaveProperty('maxTemperature');
        expect(firstBeer).toHaveProperty('temperature');
    });
    it('provides temperatures for beer ids', async () => {
        const ids = [1,2,3];
        const {statusCode, body} = await request(app).get('/api/beers/temperature?ids=' + ids.join(','));
        expect(statusCode).toEqual(200);

        expect(body.length).toBeGreaterThan(0);
        const firstTemperatureItem = body[0];
        expect(firstTemperatureItem.status).toBe('fulfilled');
        expect(firstTemperatureItem.value).toHaveProperty('id');
        expect(firstTemperatureItem.value).toHaveProperty('temperature');
    });
});
