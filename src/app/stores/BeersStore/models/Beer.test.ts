import { Beer, beerDefaultValues } from './';
import { IBeerPlain } from './Beer';

const beerTestValues: IBeerPlain = {
    id: 'test id',
    minTemperature: 3,
    maxTemperature: 4,
    type: 'IPA',
    temperature: 5,
};

describe('Beer', () => {
    const beer = new Beer();

    afterEach(() => {
        beer.reset();
    });

    it('inits with default values', () => {
        expect(beer).toEqual(beerDefaultValues);
    });

    it('accepts new values on init', () => {
        const beerWithNewValues = new Beer(beerTestValues);
        expect(beerWithNewValues).toEqual(beerTestValues);
    });

    it('resets to default values', () => {
        Object.assign(beer, beerTestValues);
        beer.reset()
        expect(beer).toEqual(beerDefaultValues);
    });
});
