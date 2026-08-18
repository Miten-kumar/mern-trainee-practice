export interface Product {

    id: number;

    name: string;

    category: string;

    description: string | null;

    createdAt: string;

}



export interface SearchResponse {

    success: boolean;

    count: number;

    data: Product[];

}