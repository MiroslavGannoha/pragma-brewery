import * as React from 'react';

const RootLayout: React.FC = ({ children }) => {
    return (
        <div className="bg-gray-200 h-full">
            { children }
        </div>
    );
};

export default RootLayout;
