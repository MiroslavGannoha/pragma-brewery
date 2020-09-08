import { observable, action } from 'mobx';
import { Beer, IBeerPlain } from './models/Beer';

type BeerTemperature = {
    id: string;
    temperature: string;
};

export type BeerTemperatureSettledResult = PromiseSettledResult<
    BeerTemperature
>[];
export const beerDefaulPollingTime = 6000;
export const defaultKeepPollingOnError = true;

export class BeersStore {
    @observable public beers: Beer[] = [];
    @observable public pollingBeerTempIds: string[] = [];
    @observable public beerPollingTime = beerDefaulPollingTime;
    @observable public keepPollingOnError = defaultKeepPollingOnError;

    @action
    public fetchBeers(): Promise<IBeerPlain[]> {
        return fetch('/api/beers')
            .then((response) => response.json())
            .then((beersPlainData: IBeerPlain[]) => {
                this.beers = [];
                beersPlainData.forEach(this.saveBeer.bind(this));
                return this.beers;
            });
    }

    @action
    public startTemperaturesPolling(ids: string[]): void {
        this.pollingBeerTempIds = ids;
        this.doTemperaturesPolling();
    }

    @action
    public stopTemperaturesPolling(): void {
        this.pollingBeerTempIds = [];
    }

    @action
    public saveBeer(beerPlainData: IBeerPlain): Beer {
        const newBeer = new Beer(beerPlainData);
        this.beers.push(newBeer);
        return newBeer;
    }

    @action
    public reset(): void {
        this.beers = [];
        this.pollingBeerTempIds = [];
        this.beerPollingTime = beerDefaulPollingTime;
        this.keepPollingOnError = defaultKeepPollingOnError;
    }

    @action
    private saveBeerTemperature({ id, temperature }: BeerTemperature): Beer {
        const currentBeer = this.beers.find((beer) => beer.id === id);
        if (!currentBeer) {
            throw new Error(`Beer with id '${id}' not found!`);
        }

        currentBeer.temperature = Number(temperature);

        return currentBeer;
    }

    @action
    private fetchTemperatures(
        ids: string[]
    ): Promise<BeerTemperatureSettledResult> {

        return fetch('/api/beers/temperature?ids=' + ids.join(','))
            .then((response) => response.json())
            .then((temperaturesData: BeerTemperatureSettledResult) => {
                temperaturesData.forEach((settledResult) => {
                    if (settledResult.status === 'rejected') {
                        return;
                    }

                    this.saveBeerTemperature(settledResult.value);
                });

                return temperaturesData;
            });
    }

    @action
    private doTemperaturesPolling(): void {
        if (!this.pollingBeerTempIds.length) {
            return;
        }

        this.fetchTemperatures(this.pollingBeerTempIds)
            .catch((error) => {
                if (!this.keepPollingOnError) {
                    this.stopTemperaturesPolling();
                    return Promise.reject(error);
                }
            })
            .then(() => {
                setTimeout(
                    () => this.doTemperaturesPolling(),
                    this.beerPollingTime
                );
            })
            .catch((error) => {
                // error handling
                console.warn(error.message);
            });
    }
}
