import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { StoreContext } from './hooks/useStore';
import {RootStore} from './stores';
import RootContainer from './containers/RootContainer';

const rootStore = new RootStore();

const App: React.FC = () => {
    return (
        <StoreContext.Provider value={rootStore}>
            <RootContainer>
                <Dashboard />
            </RootContainer>
        </StoreContext.Provider>
    );
};

export default App;
