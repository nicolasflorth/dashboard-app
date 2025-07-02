import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import categoriesFiltersReducer, { selectCategoriesFilters } from '@/features/budget-tracker/categoriesFiltersSlice';

const CategoriesFilters = () => {
    const dispatch = useAppDispatch();

    return (
        <div>
        </div>
    );
}

export default CategoriesFilters;

// Export reducer
export { categoriesFiltersReducer };