import {
    BeersStore,
    beerDefaulPollingTime,
    BeerTemperatureSettledResult,
    defaultKeepPollingOnError,
} from './';
import fetchMock from 'fetch-mock-jest';
import { IBeerPlain, Beer } from './models';
import { flushPromises } from '../../../../test/utils';

jest.useFakeTimers();

async function flushTempPollingCycle() {
    // additional flush per cycle to flush response.json() call
    await flushPromises();
    await flushPromises();
    jest.runOnlyPendingTimers();
}

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
    const beersStore: BeersStore = new BeersStore();

    beforeEach(() => {
        fetchMock.get('/api/beers', beersMockData);
    });

    afterEach(() => {
        fetchMock.mockClear();
        fetchMock.reset();
        beersStore.reset();
    });

    it('inits with default values', () => {
        expect(beersStore.beers).toEqual([]);
        expect(beersStore?.pollingBeerTempIds).toEqual([]);
        expect(beersStore?.beerPollingTime).toBe(beerDefaulPollingTime);
        expect(beersStore?.keepPollingOnError).toBe(defaultKeepPollingOnError);
    });

    it('resets to default values', () => {
        beersMockData.forEach(beersStore.saveBeer.bind(beersStore));
        beersStore.pollingBeerTempIds = ['1'];
        beersStore.beerPollingTime = 999999;
        beersStore.keepPollingOnError = false;

        beersStore.reset();

        expect(beersStore.beers).toEqual([]);
        expect(beersStore?.pollingBeerTempIds).toEqual([]);
        expect(beersStore?.beerPollingTime).toEqual(beerDefaulPollingTime);
        expect(beersStore?.keepPollingOnError).toEqual(defaultKeepPollingOnError);
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

    it('resets data on fetch', async () => {
        beersStore.saveBeer({
            id: 'some id',
            type: 'Pilsner',
            temperature: null,
            minTemperature: 3,
            maxTemperature: 5,
        });
        await beersStore?.fetchBeers();

        expect(fetchMock).toHaveFetchedTimes(1, '/api/beers');
        expect(beersStore?.beers).toEqual(beersMockData);
    });

    describe('temperatures', () => {
        const mockIds = beersMockData.map(({ id }) => id);
        const tempUrl = '/api/beers/temperature?ids=' + mockIds.join(',');

        beforeEach(() => {
            beersStore.beerPollingTime = 1;
            beersMockData.forEach(beersStore.saveBeer.bind(beersStore));
        });

        it('starts polling', async () => {
            fetchMock.get(tempUrl, temperatureSettledMock);
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

            beersStore?.startTemperaturesPolling(mockIds);

            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);

            await flushTempPollingCycle();

            expect(fetchMock).toHaveFetchedTimes(2, tempUrl);

            await flushTempPollingCycle();
            beersStore?.stopTemperaturesPolling();

            expect(fetchMock).toHaveFetchedTimes(3, tempUrl);
            expect(beersStore?.beers).toEqual(beersMockDataMerged);

            await flushTempPollingCycle();

            expect(fetchMock).toHaveFetchedTimes(3, tempUrl);
        });

        it('stops polling', async () => {
            fetchMock.get(tempUrl, temperatureSettledMock);
            beersStore?.startTemperaturesPolling(mockIds);

            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);

            beersStore?.stopTemperaturesPolling();
            await flushTempPollingCycle();

            expect(fetchMock).toHaveFetchedTimes(1, tempUrl);
        });

        describe('keepPollingOnError param', () => {
            it('keeps polling on error by default', async () => {
                fetchMock.get(tempUrl, {
                    throws: new Error('Failed to fetch'),
                });

                beersStore?.startTemperaturesPolling(mockIds);

                expect(fetchMock).toHaveFetchedTimes(1, tempUrl);

                await flushTempPollingCycle();
                beersStore?.stopTemperaturesPolling();

                expect(fetchMock).toHaveFetchedTimes(2, tempUrl);

                expect(beersStore?.beers).toEqual(beersMockData);
            });

            it('keeps no polling if set to false', async () => {
                fetchMock.get(tempUrl, {
                    throws: new Error('Failed to fetch'),
                });
                beersStore.keepPollingOnError = false;
                beersStore?.startTemperaturesPolling(mockIds);

                expect(fetchMock).toHaveFetchedTimes(1, tempUrl);

                await flushTempPollingCycle();

                expect(fetchMock).toHaveFetchedTimes(1, tempUrl);

                expect(beersStore?.beers).toEqual(beersMockData);
            });
        });
    });
});
