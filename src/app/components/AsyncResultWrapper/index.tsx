import * as React from 'react';
import { UseAsyncResult } from '../../hooks/useAsync';

export const AsyncResultWrapper: React.FC<{ result: UseAsyncResult }> = ({
    result,
    children,
}) => {
    switch (result.status) {
        case 'pending':
            return <>Loading ...</>;
        case 'fulfilled':
            return <>{children}</>;
        case 'rejected':
            return <>Failed to fetch: {result.reason}</>;
        default:
            return null;
    }
};
