import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useSearch } from "../hooks/useSearch";
import SearchResults from "./SearchResults";
import EmptyState from "./EmptyText";


export default function SearchBox() {

    const [search, setSearch] = useState("");

    const [activeIndex, setActiveIndex] = useState(-1);

    // Debounce user input (300ms)
    const debouncedSearch =
        useDebounce(
            search,
            300
        );

    const {
        results,
        loading
    } = useSearch(
        debouncedSearch
    );

    const handleKeyboard = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {

        // Move selection down

        if (e.key === "ArrowDown") {

            e.preventDefault();

            setActiveIndex(previous => {

                if (previous >= results.length - 1) {

                    return 0;

                }
                return previous + 1;
            });
        }

        // Move selection up
        if (e.key === "ArrowUp") {

            e.preventDefault();

            setActiveIndex(previous => {

                if (previous <= 0) {

                    return results.length - 1;
                }
                return previous - 1;
            });
        }

        // Select product

        if (e.key === "Enter") {
            e.preventDefault();

            const selectedProduct =
                results[activeIndex];

            if (selectedProduct) {

                console.log(
                    "Selected Product:",
                    selectedProduct
                );

                setSearch(
                    selectedProduct.name
                );
            }
        }


        // Clear search

        if (e.key === "Escape") {

            setSearch("");

            setActiveIndex(-1);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearch(
            e.target.value
        );

        // Reset keyboard selection
        setActiveIndex(-1);
    };

    const clearSearch = () => {

        setSearch("");

        setActiveIndex(-1);
    };

    return (

        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={search}
                    placeholder="Search products like laptops, mobiles, accessories..."
                    onChange={handleChange}
                    onKeyDown={handleKeyboard}
                    aria-label="Search products"
                />

                {
                    search &&
                    <button
                        className="clear-button"

                        onClick={clearSearch}

                    >
                        ✕

                    </button>
                }

            </div>

            {
                loading &&
                <div className="skeleton-container">

                    <div className="skeleton"></div>

                    <div className="skeleton"></div>

                    <div className="skeleton"></div>

                </div>

            }

            {
                !loading &&

                debouncedSearch.length >= 2 &&

                results.length === 0 &&

                <EmptyState/>

            }

            {
                !loading &&

                results.length > 0 &&

                <SearchResults

                    products={results}

                    query={debouncedSearch}

                    activeIndex={activeIndex}
                />
            }
        </div>
    );
}