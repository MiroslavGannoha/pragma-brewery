import { observable, computed } from 'mobx';

export class RootStore {
    @observable value1 = 0;
    @observable value2 = 1;

    @computed get total(): number {
        return this.value1 * this.value2;
    }
}