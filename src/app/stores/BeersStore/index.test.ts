import {
    BeersStore,
    beerDefaulPollingTime,
    BeerTemperatureSettledResult,
} from './';
import fetchMock from 'fetch-mock-jest';
import { IBeerPlain, Beer } from './models';
import { flushPromises } from '../../../../test/utils';

const beersMockData: Readonly<IBeerPlain[]> = [
    {
        id: '1',
        type: 'Pilsner',
        minTemperature: 4,
        maxTemperature: 6,
        temperature: null,
    },
    {
        id: '2',
        type: 'IPA',
        minTemperature: 5,
        maxTemperature: 6,
        temperature: null,
    },
];

const temperatureSettledMock: Readonly<BeerTemperatureSettledResult> = [
    {
        status: 'fulfilled',
        value: { id: beersMockData[0].id, temperature: '2' },
    },
    {
        status: 'fulfilled',
        value: { id: beersMockData[1].id, temperature: '-1' },
    },
    {
        status: 'rejected',
        reason: 'some error',
    },
];

describe('BeersStore', () => {
    fetchMock.get('/api/beers', beersMockData);

    const beersStore: BeersStore = new BeersStore();

    afterEach(() => {
        fetchMock.mockClear();
        beersStore.reset();
    });

    it('inits with default values', () => {
        expect(beersStore.beers).toEqual([]);
        expect(beersStore?.pollingBeerTempIds).toEqual([]);
        expect(beersStore?.beerPollingTime).toEqual(beerDefaulPollingTime);
    });

    it('resets to default values', () => {
        beersMockData.forEach(beersStore.saveBeer.bind(beersStore));
        beersStore.pollingBeerTempIds = ['1'];
        beersStore.beerPollingTime = 999999;

        beersStore.reset();

        expect(beersStore.beers).toEqual([]);
        expect(beersStore?.pollingBeerTempIds).toEqual([]);
        expect(beersStore?.beerPollingTime).toEqual(beerDefaulPollingTime);
    });

    it('stores beer data', () => {
        beersMockData.forEach(beersStore.saveBeer.bind(beersStore));

        expect(beersStore?.beers).toEqual(beersMockData);
        expect(beersStore?.beers[0]).toBeInstanceOf(Beer);
        expect(beersStore?.beers[1]).toBeInstanceOf(Beer);
    });

    it('fetches beers data', async () => {
        await beersStore?.fetchBeers();

        expect(fetchMock).toHaveFetchedTimes(1, '/api/beers');
        expect(beersStore?.beers).toEqual(beersMockData);
    });

    describe('temperatures', () => {
        const mockIds = beersMockData.map(({ id }) => id);
        const tempUrl = '/api/beers/temperature?ids=' + mockIds.join(',');
        fetchMock.get(tempUrl, temperatureSettledMock);

        it('starts polling', async () => {
            // beers and temepratures merged
            const beersMockDataMerged = beersMockData.map((beer, indx) => {
                const tempData = temperatureSettledMock[indx];
                return {
                    ...beer,
                    temperature:
                        tempData.status === 'fulfilled'
                            ? Number(tempData.value.temperature)
                            : null,
                };
            });
    
            beersStore.beerPollingTime = 1;
            beersMockData.forEach(beersStore.saveBeer.bind(beersStore));
    
            beersStore?.startTemperaturesPolling(mockIds);
    
            // additional flush per cycle to flush response.json() call
            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);
            await flushPromises();
            await flushPromises();
            expect(fetchMock).toHaveFetchedTimes(2, tempUrl);
            await flushPromises();
            await flushPromises();
            expect(fetchMock).toHaveFetchedTimes(3, tempUrl);
            expect(beersStore?.beers).toEqual(beersMockDataMerged);
    
            beersStore?.stopTemperaturesPolling();
        });
    
        it('stops polling', async () => {
            const mockIds = beersMockData.map(({ id }) => id);
            const tempUrl = '/api/beers/temperature?ids=' + mockIds.join(',');
    
            beersMockData.forEach(beersStore.saveBeer.bind(beersStore));
    
            beersStore?.startTemperaturesPolling(mockIds);
            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);
            beersStore?.stopTemperaturesPolling();
            await flushPromises();
            await flushPromises();
            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);
        });
    })
});
