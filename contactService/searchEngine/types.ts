export type EngineSearchT<T1, T2 = T1> = (
    query: string,
    contentToSearch: T1[],
    handleResult?: <T2>(result: T1) => T2
) => T2[];
