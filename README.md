# 🍻 Pragma Brewery

#### To run the project

`Nodejs` must be installed. Desirably one of the latest versions - I have used `v14.8.0`.
And then run from the command line:
```
npm install
npm run build
npm start
```
http://localhost:3000/

For testing
```
npm test
```

If you have any troubles running the project please let me know.

#### The challenge
Shane is responsible for driving the large transport
truck, delivering goods from the brewery to a number of pubs across the city each week.
Each beer has its own specific refrigeration needs while being transported:
- Beer 1 (Pilsner): 4°C - 6°C
- Beer 2 (IPA): 5°C - 6°C
- Beer 3 (Lager): 4°C - 7°C
- Beer 4 (Stout): 6°C - 8°C
- Beer 5 (Wheat beer): 3°C - 5°C
- Beer 6 (Pale Ale): 4°C - 6°C
The refrigerated truck is loaded with multiple containers with beer bottles inside, each
container set to a specific temperature and each containing a thermometer sensor.
While driving, Shane is alerted if any of the containers fall outside of the temperature range.
Unfortunately, this is common due to factors such as opening the doors to unload, the heat of
the Sydney summer or sometimes due to forgetting the container doors ajar.
Develop a solution that allows Shane to be aware of the current temperature of each container
and notifies him when the temperatures are outside the correct range.

#### Questions

-   **What are the highlights of your logic/code writing style?**
    Main piece is probably polling logic. For example if "Shane" would lost his connection for some time it would still try to fetch data over and over. But behaviour can be changed with `keepPollingOnError` param. (Which actually could be improved too by allowing setting number of times to retry instead of always "yes" or always "no". One more item for next question :) ).
    First catch here decides whether handle error and pass to next then or break the chain and reject promise. Which then will be handled in next catch.
    `this.pollingBeerTempIds.length` check serves here both as error avoider and polling breaker, `stopTemperaturesPolling` does exactly that - sets empty array for `this.pollingBeerTempIds`.

    ```typescript
    private doTemperaturesPolling(): void {
        if (!this.pollingBeerTempIds.length) {
            return;
        }

        this.fetchTemperatures(this.pollingBeerTempIds)
            .catch((error) => {
                if (this.keepPollingOnError) {
                    console.log('Couldn\'t fetch temperatures - retrying');
                    return;
                }
                this.stopTemperaturesPolling();
                return Promise.reject(error);
            })
            .then(() => {
                setTimeout(
                    () => this.doTemperaturesPolling(),
                    this.beerPollingTime
                );
            })
            .catch((error) => {
                // error handling
                console.warn(error.message);
            });
    }
    ```

    Also there is good showcase for new typescript operator `??`. Temperature could be `null` or `number` as declared in Beer model. `null` - when no data received yet and any `number` - when at least one response data recorded. Regular `if` or analogical operator would not display `0` temp. But `??` operator helps here.

    ```typescript
    export interface IBeerPlain {
        id: string;
        minTemperature: number;
        maxTemperature: number;
        type: BeerType;
        temperature: null | number;
    }

    // ...................
    <td className="...">{temperature ?? 'n/a'}</td>;
    // ...................
    ```

    `useAsync` hook with `AsyncResultContentWrapper` also good example for handling any async request in react components.

    ```typescript
    // ...................
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
    // ...................
    const beersFetchResult = useAsync(() => beersStore.fetchBeers());
    // ...................

    <AsyncResultWrapper result={beersFetchResult}>
        <BeersTable beers={beers} />
    </AsyncResultWrapper>;
    ```

-   **What could you do better in your code next iteration?**
    Having more time I would add tests for react components, improve tests overall. Also I could add routing and some navigation.
    Would improve error handling, especially need to show some error when temeprature requests failing. It will still show last temperature received so that "Shane" would at least know recently recorded data. But if it keeps failing for a long time "Shane" must know that to take some actions as temperature level may become too critical.
-   **What were the questions you would ask and your own answers/assumptions?**
    I think solution is pretty self-explanatory in that regard.
-   **Any other notes you feel relevant for the evaluation of your solution**
    DB - Just a JSON file with data
    BE - `server/index.ts`file is a default code generated by express-generator
    FE - `mobx` with `mobx-react-lite` helps synchronize app state with react components efficiently. `Tailwind.css` provides various utility classes & helps style components quickly.
