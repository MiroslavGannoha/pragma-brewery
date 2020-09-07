import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { StoreContext } from './hooks/useStore';
import { RootStore } from './stores';
import RootLayout from './layouts/RootLayout';
import PublicLayout from './layouts/PublicLayout';

const rootStore = new RootStore();

const App: React.FC = () => {
    return (
        <StoreContext.Provider value={rootStore}>
            <RootLayout>
                <PublicLayout>
                    <Dashboard />
                </PublicLayout>
            </RootLayout>
        </StoreContext.Provider>
    );
};

export default App;
