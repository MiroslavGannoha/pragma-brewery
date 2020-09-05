declare module '*.json' {
    const value: unknown;
    export default value;
}

declare namespace jest {
    interface Matchers<R> {
        toHaveFetched: (expected: string) => CustomMatcherResult;
        toHaveFetchedTimes: (n: number, expected?: string) => CustomMatcherResult;
    }
}
