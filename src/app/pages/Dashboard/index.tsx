import * as React from 'react';
import { useStore } from '../../hooks/useStore';

const Dashboard: React.FC = () => {
    const rootStore = useStore();
    console.log('rootStore', rootStore);
    
    return (
        <div>
            Dashboard
        </div>
    );
};

export default Dashboard;