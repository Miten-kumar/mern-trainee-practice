export interface Product {

    id: string;

    name: string;

    description?: string | null;

    price: number;

    image?: string | null;

    createdAt: Date;

    updatedAt: Date;

}

export interface ProductResponse {

    products: Product[];

    nextCursor: string | null;

    hasMore: boolean;

}

export interface ProductQueryParams {

    cursor?: string;

    limit?: number;

}