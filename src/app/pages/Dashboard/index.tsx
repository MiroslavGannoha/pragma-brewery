import * as React from 'react';
import { useStore } from '../../hooks/useStore';
import { observer } from 'mobx-react-lite';
import { useAsync } from '../../hooks/useAsync';
import BeersTable from './BeersTable';
import { Card, ContentWrapper, AsyncResultWrapper } from '../../components';

const Dashboard: React.FC = observer(() => {
    const { beersStore } = useStore();
    const { beers } = beersStore;
    const beersFetchResult = useAsync(() => beersStore.fetchBeers());

    React.useEffect(() => {
        const { status } = beersFetchResult;
        if (status === 'fulfilled') {
            beersStore.startTemperaturesPolling(beers.map(({ id }) => id));
        } else if (status === 'rejected') {
            beersStore.stopTemperaturesPolling();
        }
        return () => beersStore.stopTemperaturesPolling();
    }, [beersFetchResult.status]);

    return (
        <ContentWrapper>
            <Card.Container className="xl:w-2/3">
                <Card.Body>
                    <Card.Title className="text-center">
                        Beer Temperature Monitor
                    </Card.Title>
                    <AsyncResultWrapper result={beersFetchResult}>
                        <BeersTable beers={beers} />
                    </AsyncResultWrapper>
                </Card.Body>
            </Card.Container>
        </ContentWrapper>
    );
});

export default Dashboard;
