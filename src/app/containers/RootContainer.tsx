import * as React from 'react';

const RootContainer: React.FC = ({children}) => {

    return (
        <div className="bg-gray-100 h-full">
            {children}
        </div>
    );
};

export default RootContainer;