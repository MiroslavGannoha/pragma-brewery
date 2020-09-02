import * as React from 'react';
import { RootStore } from '../stores';

export const StoreContext = React.createContext(new RootStore());
export const useStore = (): RootStore => React.useContext(StoreContext);