import * as React from 'react';

export const ContentWrapper: React.FC = ({ children }) => {
    return <div className="p-5 h-full flex items-start justify-center">{children}</div>;
};
