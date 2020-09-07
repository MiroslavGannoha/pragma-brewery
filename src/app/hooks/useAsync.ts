import * as React from 'react';

export type AsyncStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

interface IdleResult {
    status: 'idle';
}

interface PendingResult {
    status: 'pending';
}

interface FulfilledResult {
    status: 'fulfilled';
    data: any;
}

interface RejectedResult {
    status: 'rejected';
    reason: string;
}

export type UseAsyncResult =
    | IdleResult
    | PendingResult
    | FulfilledResult
    | RejectedResult;

const defaultErrorMessage = 'Failed to fulfill request';

export function useAsync(request: () => Promise<any>): UseAsyncResult {
    const [status, setStatus] = React.useState<AsyncStatus>('idle');
    const [data, setData] = React.useState<any>(null);
    const [reason, setReason] = React.useState<string>(defaultErrorMessage);

    React.useEffect(() => {
        setStatus('pending');
        request()
            .then((d) => {
                setStatus('fulfilled');
                setData(d);
            })
            .catch((error) => {
                setStatus('rejected');
                setReason(error);
            });
    }, []);

    if (status === 'fulfilled') {
        return { status, data };
    }
    if (status === 'rejected') {
        return { status, reason };
    }

    return { status };
}
