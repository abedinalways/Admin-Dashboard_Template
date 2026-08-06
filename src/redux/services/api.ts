import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '../store';

// Base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state (more secure and type-safe than localStorage)
    const state = getState() as RootState;
    const token = state.auth?.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced base query with better error handling
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle token refresh or logout here if needed
  if (result.error && result.error.status === 401) {
    // Dispatch logout action or clear auth state
    // api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Product',
    'Order',
    'Category',
    'Dashboard',
    // Add more tags as needed
  ],
  endpoints: () => ({}),
});

export default apiSlice;
