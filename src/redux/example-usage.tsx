/**
 * Example: How to use Redux Toolkit Query in your components
 * 
 * This file demonstrates best practices for using RTK Query
 */

import {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useAppDispatch,
  apiSlice,
} from './hooks';

// Example 1: Fetching data (GET requests)
export const ExampleUserList = () => {
  // Use the auto-generated hook
  const { data: users, isLoading, error, refetch } = useGetUsersQuery({
    page: 1,
    limit: 10,
    search: 'john',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

// Example 2: Fetching single item
export const ExampleUserDetail = ({ userId }: { userId: string }) => {
  const { data: user, isLoading } = useGetUserQuery(userId);

  if (isLoading) return <div>Loading...</div>;

  return <div>{user?.name}</div>;
};

// Example 3: Creating data (POST request)
export const ExampleCreateUser = () => {
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
      console.error('Failed to create user:', error);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create User'}
    </button>
  );
};

// Example 4: Updating data (PATCH request)
export const ExampleUpdateUser = ({ userId }: { userId: string }) => {
  const [updateUser] = useUpdateUserMutation();

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateUser({
        id: userId,
        data: { name: 'Jane Doe' },
      }).unwrap();
      
      console.log('User updated:', updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return <button onClick={handleUpdate}>Update User</button>;
};

// Example 5: Deleting data
export const ExampleDeleteUser = ({ userId }: { userId: string }) => {
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      console.log('User deleted');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return <button onClick={handleDelete}>Delete User</button>;
};

// Example 6: Using dispatch for manual cache invalidation
export const ExampleInvalidateCache = () => {
  const dispatch = useAppDispatch();

  const handleRefresh = () => {
    // Manually refetch or invalidate cache
    dispatch(apiSlice.util.invalidateTags(['User']));
  };

  return <button onClick={handleRefresh}>Refresh Users</button>;
};

// Example 7: Product operations
export const ExampleProductList = () => {
  const { data: products, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 10,
    category: 'electronics',
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div>
      {products?.map((product: { id: string; name: string }) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
