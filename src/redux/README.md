# Redux Toolkit + RTK Query Setup

This project uses Redux Toolkit with RTK Query for state management and API integration.

## Project Structure

```
src/redux/
├── store.ts              # Redux store configuration
├── ReduxProvider.tsx     # Provider wrapper for Next.js
├── hooks.ts              # Custom hooks (useAppDispatch, useAppSelector)
├── index.ts              # Main exports
├── types/
│   └── index.ts          # TypeScript type definitions
├── services/
│   ├── api.ts            # Base API configuration
│   ├── userApi.ts        # User API endpoints
│   └── productApi.ts     # Product API endpoints
└── example-usage.tsx     # Usage examples
```

## Setup Complete ✅

### Installed Packages
- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux

### Key Features
1. **Type-safe** - Full TypeScript support with typed hooks
2. **Auto-generated hooks** - RTK Query generates hooks automatically
3. **Caching** - Built-in request caching and deduplication
4. **Optimistic updates** - Support for optimistic UI updates
5. **Error handling** - Centralized error handling
6. **Auto-refetch** - Automatic refetching on window focus, network reconnect

## Usage Guide

### 1. Fetching Data (GET)

```typescript
import { useGetUsersQuery } from '@/redux';

const UserList = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
```

### 2. Creating Data (POST)

```typescript
import { useCreateUserMutation } from '@/redux';

const CreateUser = () => {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleCreate = async () => {
    try {
      const newUser = await createUser({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secure123',
      }).unwrap();
      
      console.log('User created:', newUser);
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return <button onClick={handleCreate}>Create User</button>;
};
```

### 3. Updating Data (PATCH)

```typescript
import { useUpdateUserMutation } from '@/redux';

const UpdateUser = ({ userId }: { userId: string }) => {
  const [updateUser] = useUpdateUserMutation();

  const handleUpdate = async () => {
    try {
      await updateUser({
        id: userId,
        data: { name: 'Jane Doe' },
      }).unwrap();
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return <button onClick={handleUpdate}>Update User</button>;
};
```

### 4. Deleting Data

```typescript
import { useDeleteUserMutation } from '@/redux';

const DeleteUser = ({ userId }: { userId: string }) => {
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
    } catch (error) {
      console.error('Failed:', error);
    }
  };

  return <button onClick={handleDelete}>Delete User</button>;
};
```

### 5. Using Dispatch and Selector

```typescript
import { useAppDispatch, useAppSelector } from '@/redux';
import { apiSlice } from '@/redux';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  // For accessing Redux state (if you add reducers later)
  const user = useAppSelector((state) => state.someReducer.user);

  const handleRefresh = () => {
    // Invalidate cache and refetch
    dispatch(apiSlice.util.invalidateTags(['User']));
  };

  return <button onClick={handleRefresh}>Refresh</button>;
};
```

## Configuration

### Base URL
Set your API base URL in environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```
Default: `/api`

### Authentication
Add authentication headers in `src/redux/services/api.ts`:
```typescript
prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
},
```

## Adding New API Endpoints

### Step 1: Define Types (if needed)
```typescript
// src/redux/types/index.ts
export interface YourType {
  id: string;
  // ... fields
}
```

### Step 2: Create API Service
```typescript
// src/redux/services/yourApi.ts
import { apiSlice } from './api';
import type { YourType } from '../types';

export const yourApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<YourType[], void>({
      query: () => '/your-endpoint',
    }),
    createItem: builder.mutation<YourType, CreateDto>({
      query: (data) => ({
        url: '/your-endpoint',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = yourApi;
```

### Step 3: Export Hooks
The hooks are automatically exported via `src/redux/hooks.ts`.

### Step 4: Use in Components
```typescript
import { useGetItemsQuery, useCreateItemMutation } from '@/redux';
```

## Cache Management

RTK Query automatically manages cache. Use tags to control invalidation:

```typescript
// In your API definition
getUsers: builder.query({
  query: () => '/users',
  providesTags: [{ type: 'User', id: 'LIST' }],
}),

createUser: builder.mutation({
  query: (data) => ({ url: '/users', method: 'POST', body: data }),
  invalidatesTags: [{ type: 'User', id: 'LIST' }], // Auto-refetches users list
}),
```

## Environment Variables

Create `.env.local` in your project root:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Best Practices

1. **One API slice per resource** - Keep endpoints organized
2. **Use TypeScript** - Leverage type safety
3. **Tag-based invalidation** - Use tags for cache management
4. **Error handling** - Use `.unwrap()` for better error handling
5. **Loading states** - Always show loading indicators
6. **Optimistic updates** - Use for better UX when appropriate

## Next Steps

1. Create API services for your resources (Orders, Categories, etc.)
2. Add authentication flow with token refresh
3. Implement optimistic updates where needed
4. Add request/response interceptors if needed
5. Set up API mocking for development/testing

## Resources

- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [React-Redux Docs](https://react-redux.js.org/)