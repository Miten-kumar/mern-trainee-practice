export interface ProductSearchResult {
    id: number,
    name: string,
    category: string,
    description: string | null,
    createdAt : Date;
}

export interface SearchResponse {
    success: Boolean,
    count: number,
    data: ProductSearchResult[];
}