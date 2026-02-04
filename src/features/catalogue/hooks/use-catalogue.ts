import { useState, useMemo } from "react";
import { Product, filterProducts } from "@/data/store-data";

interface UseCatalogueProps {
    initialProducts: Product[];
    initialFilters?: Record<string, string[]>;
}

export const useCatalogue = ({ initialProducts, initialFilters = {} }: UseCatalogueProps) => {
    // 1. State for Filtering & Sorting
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(initialFilters);
    const [sortBy, setSortBy] = useState<string>("newest");

    // 2. The Engine: Filter and Sort logic
    const filteredAndSortedProducts = useMemo(() => {
        // Apply the universal filter engine from store-data
        let result = filterProducts(initialProducts, activeFilters);

        // Apply Sorting
        const sorted = [...result];
        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => a.defaultPrice - b.defaultPrice);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.defaultPrice - a.defaultPrice);
                break;
            case "most-sold":
                sorted.sort((a, b) => b.salesCount - a.salesCount);
                break;
            case "popularity":
                sorted.sort((a, b) => b.popularityScore - a.popularityScore);
                break;
            default: // newest
                sorted.sort((a, b) => b.staticNumber - a.staticNumber);
        }
        return sorted;
    }, [initialProducts, activeFilters, sortBy]);

    // 3. Handlers
    const handleFilterChange = (key: string, value: string, isSingleSelect: boolean = false) => {
        setActiveFilters((prev) => {
            const currentValues = prev[key] || [];

            if (isSingleSelect) {
                return { ...prev, [key]: [value] };
            }

            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];

            return { ...prev, [key]: newValues };
        });
    };

    const clearFilters = () => setActiveFilters({});

    return {
        products: filteredAndSortedProducts,
        activeFilters,
        handleFilterChange,
        clearFilters,
        sortBy,
        setSortBy,
        totalResults: filteredAndSortedProducts.length,
    };
};