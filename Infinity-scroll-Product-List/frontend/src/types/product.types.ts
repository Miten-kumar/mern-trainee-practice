export interface Product {

    id: string;

    name: string;

    description: string | null;

    price: number;

    image: string | null;

    createdAt: string;

    updatedAt: string;

}

export interface ProductResponse {

    products: Product[];

    nextCursor: string | null;

    hasMore: boolean;

}