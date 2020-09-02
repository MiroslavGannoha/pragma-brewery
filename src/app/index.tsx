import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { StoreContext } from './hooks/useStore';
import {RootStore} from './stores';

const rootStore = new RootStore();

const App: React.FC = () => {
    return (
        <StoreContext.Provider value={rootStore}>
            <Dashboard />
        </StoreContext.Provider>
    );
};

export default App;
