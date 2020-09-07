declare module '*.json' {
    const value: unknown;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare namespace jest {
    interface Matchers<R> {
        toHaveFetched: (expected: string) => CustomMatcherResult;
        toHaveFetchedTimes: (n: number, expected?: string) => CustomMatcherResult;
    }
}
