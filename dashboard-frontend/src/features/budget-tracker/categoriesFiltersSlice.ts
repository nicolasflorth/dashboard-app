//slice, actions, reducer
import { createSlice } from '@reduxjs/toolkit';
import type { CategoryFilterType } from '@/types/categoryFilter';
import { RootState } from '@/app/store';


const categoriesFiltersSlice = createSlice({
    name: 'categoriesFilters',
    initialState: {
        filters: [] as CategoryFilterType[],
    },
    reducers: {
    },
});

export const {  } = categoriesFiltersSlice.actions;
export default categoriesFiltersSlice.reducer;

export const selectCategoriesFilters = (state: RootState) => state.categoriesFilters.filters;
