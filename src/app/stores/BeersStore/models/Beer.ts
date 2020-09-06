import { observable, action } from 'mobx';

export type BeerType =
    | 'Pilsner'
    | 'IPA'
    | 'Lager'
    | 'Stout'
    | 'Wheat beer'
    | 'Pale Ale';

export interface IBeerPlain {
    id: string;
    minTemperature: number;
    maxTemperature: number;
    type: BeerType;
    temperature: null | number;
}

export const beerDefaultValues: Readonly<IBeerPlain> = {
    id: '0',
    minTemperature: 0,
    maxTemperature: 1,
    type: 'Pilsner',
    temperature: null,
};

export class Beer implements IBeerPlain {
    @observable id = beerDefaultValues.id;
    @observable minTemperature = beerDefaultValues.minTemperature;
    @observable maxTemperature = beerDefaultValues.maxTemperature;
    @observable type: BeerType = beerDefaultValues.type;
    @observable temperature: null | number = beerDefaultValues.temperature;

    constructor(plainBeerData?: IBeerPlain) {
        if (plainBeerData) {
            Object.assign(this, plainBeerData);
        }
    }

    @action
    public reset(): void {
        Object.assign(this, beerDefaultValues);
    }
}
