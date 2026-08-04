import { useEffect, useState } from "react";
import { searchProducts } from "../api/searchApi";
import type { Product } from "../types/search.types";

export const useSearch = (

    query: string

) => {

    const [results, setResults] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string | null>(null);


    useEffect(() => {

        // Clear results if query empty

        if (!query.trim()) {

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);

            return;

        }

        // Minimum characters optimization

        if(query.length < 2){

            setResults([]);

            return;

        }

        const controller =
            new AbortController();

        const fetchResults = async () => {

            try {

                setLoading(true);

                setError(null);

                const data =
                    await searchProducts(

                        query,

                        controller.signal

                    );

                setResults(data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch(error:any){

                // Ignore cancelled requests

                if(error.name !== "CanceledError") {

                    setError(
                        "Something went wrong"
                    );

                }

            } finally {

                setLoading(false);
            }
        };

        fetchResults();

        // Cancel previous API request

        return () => {
            controller.abort();
        };

    },[query]);

    return {
        results,
        loading,
        error
    };
};