export interface ISearchEngine<T1, T2 = T1> {
    search(query: string, contentToSearch: T1[]): T2[];
}
