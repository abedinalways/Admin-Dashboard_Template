# Redux + RTK Query কিভাবে কাজ করে (বাংলায় সহজ ব্যাখ্যা)

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER COMPONENT (আপনার পেজ/কম্পোনেন্ট)                    │
│    예: UserList, Dashboard, Settings etc.                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ useGetUsersQuery() hook কল করে
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AUTO-GENERATED HOOK (RTK Query automatically generate)   │
│    - isLoading, error, data স্টেট ম্যানেজ করে               │
│    - Cache চেক করে                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │ API কল prepared হয়
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API SLICE (src/redux/services/api.ts)                    │
│    - baseUrl যোগ করে: /api/users                            │
│    - Authorization header যোগ করে (token from Redux state)  │
│    - Request鞠ে prepared করছে                                │
└──────────────────┬──────────────────────────────────────────┘
                   │ Request পাঠানো হচ্ছে
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. SERVER (আপনার Backend API)                              │
│    - Request receives করে                                     │
│    - Database থেকে data নieck করে                            │
│    - Response পাঠায়                                           │
└──────────────────┬──────────────────────────────────────────┘
                   │ Response আসছে
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. REDUX STORE (src/redux/store.ts)                         │
│    - Response data cache এ সেভ করে                            │
│    - Component কে data দেয়                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ Data পাচ্ছে
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. COMPONENT RENDERS                                        │
│    - data দেখানো হয় UI তে                                    │
│    - loading/error handling হয়                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 মূল ধারণা (Core Concepts)

### ১. Redux Toolkit (State Management)
```typescript
// Store = আপনার 전체 অ্যাপের centralized memory
// যেমন: আপনি আলাদা আলাদা নোটে ডাটা রাখেন, 
// Redux Store সেখানে সব centralized ভাবে রাখে

const store = {
  auth: { user, token, isAuthenticated },  // অথেনটিকেশন স্টেট
  api: { users[], products[], cache }      // API data & cache
}
```

### ২. RTK Query (API Integration)
```typescript
// RTK Query automatically করে:
// ✅ API calls
// ✅ Caching (ডুplicate call এড়ানো)
// ✅ Loading/Error states
// ✅ Background refetch
// ✅ Cache invalidation
```

---

## 🔄 Detailed Flow Examples

### Example 1: ডাটা লোড করা (GET Request)

```
Step 1: Component লোড হয়
  ↓
  const { data, isLoading } = useGetUsersQuery()

Step 2: Hook চেক করে - ক্যাশে里有 data আছে কিনা?
  ↓
  NO → API কল করে
  YES → cached data দিয়ে দেয়

Step 3: Request গোটা হয়
  Headers: {
    Authorization: Bearer <token from Redux state>
  }
  URL: /api/users?page=1&limit=10

Step 4: Server রেসপন্স দেয়
  Response: { users: [...], total: 100 }

Step 5: Redux Store এ সেভ হয়
  Cache: users[1] = response data

Step 6: Component এ data আসে
  {data} → UI তে দেখানো হয়
```

### Example 2: নতুন ডাটা যোগ করা (POST Request)

```
Step 1: User ক্লিক করে "Add User" বাটনে
  ↓
Step 2: Mutation hook কল হয়
  const [createUser] = useCreateUserMutation()
  await createUser({ name: 'Rahim', email: 'rahim@test.com' })

Step 3: API এ POST request যায়
  POST /api/users
  Body: { name: 'Rahim', email: 'rahim@test.com' }

Step 4: Server নতুন user creates করে
  Response: { id: 5, name: 'Rahim', ... }

Step 5: Store আপডেট হয়
  ✅ 'User' tag invalidate হয়
  ✅ getUsers query automatically refetch হয়
  ✅ New user নিয়ে list আপডেট হয়

Step 6: UI automatically আপডেট হয়
  - নতুন user list এ দেখা যায়
  - কোনো manual refresh লাগে না
```

### Example 3: ডাটা আপডেট করা (PATCH Request)

```
Step 1: User profile edit করে "Save" ক্লিক করে
  ↓
Step 2: updateUser mutation কল হয়
  updateUser({ id: '123', data: { name: 'Karim' } })

Step 3: PATCH request যায়
  PATCH /api/users/123
  Body: { name: 'Karim' }

Step 4: Server update করে
  Response: { id: '123', name: 'Karim', ... }

Step 5: Cache আপডেট হয়
  ✅ User list আপডেট হয়
  ✅ Single user cache আপডেট হয়

Step 6: UI automatically রিফ্রেশ হয়
```

---

## 🏗️ File Structure & Their Roles

```
src/redux/
│
├── store.ts                    # 🔧 Main Redux Store
│   ├── auth reducer যোগ করে     # (for token management)
│   ├── api reducer যোগ করে      # (for RTK Query cache)
│   └── middleware সেটআপ করে     # (for API calls)
│
├── ReduxProvider.tsx           # 📦 Next.js এ Provider wrap করে
│   └── <Provider store={store}> # (store accessible everywhere)
│
├── hooks.ts                    # 🎣 Typed hooks একসাথে exports করে
│   ├── useAppDispatch           # (custom typed dispatch)
│   ├── useAppSelector           # (custom typed selector)
│   ├── useGetUsersQuery         # (from userApi.ts)
│   ├── useCreateUserMutation    # (from userApi.ts)
│   └── useGetProductsQuery      # (from productApi.ts)
│
├── features/
│   └── authSlice.ts             # 🔐 Authentication Management
│   ├── State: user, token, isAuthenticated
│   ├── Actions: login, logout, setToken
│   └── Auto-save to localStorage
│
├── services/
│   ├── api.ts                   # 🌐 Base API Configuration
│   ├── baseUrl: /api (or env variable)
│   ├── Headers: Auto-add Authorization token
│   ├── Error handling: 401 → logout
│   └── TagTypes: For cache management
│   │
│   ├── userApi.ts               # 👤 User API Endpoints
│   │   ├── getUsers() → GET /users
│   │   ├── getUser() → GET /users/:id
│   │   ├── createUser() → POST /users
│   │   ├── updateUser() → PATCH /users/:id
│   │   └── deleteUser() → DELETE /users/:id
│   │
│   └── productApi.ts            # 📦 Product API Endpoints
│       ├── getProducts() → GET /products
│       ├── createProduct() → POST /products
│       └── ... etc
│
├── types/
│   └── index.ts                 # 📝 TypeScript Types
│   ├── User, Product, Order
│   ├── CreateUserDto, UpdateUserDto
│   └── ApiResponse, PaginatedResponse
│
├── index.ts                     # 🚀 Main Exports (সবকিছু একসাথে)
│   └── import { useGetUsersQuery } from '@/redux'
│
├── example-usage.tsx            # 💡 Practical Examples (৭টা)
│
└── README.md                    # 📚 Documentation
```

---

## 🔑 Key Points (মূল বিষয়সমূহ)

### ১. Authentication Token Handling
```typescript
// OLD WAY (localStorage থেকে)
const token = localStorage.getItem('token')  // ❌ Less secure

// NEW WAY (Redux state থেকে)
const token = getState().auth.token  // ✅ Type-safe & secure

// baseQuery automatically token header এ যোগ করে
headers.set('authorization', `Bearer ${token}`)
```

### ২. How Caching Works
```
First Request:
  useGetUsersQuery() → API call → Cache এ সেভ → Data দেখাও

Second Request (same params):
  useGetUsersQuery() → Cache থেকে data দাও → No API call ⚡

After Creating User:
  createUser() → API call → 'User' tag invalidate → 
  getUsers query refetch → New data → UI আপডেট
```

### ৩. Tag-based Invalidation
```typescript
// Products create হলে
createProduct() → invalidatesTags: ['Product', 'Product:LIST']
  ↓
getProducts() query automatically refetch হয় ✅
getProduct(id) query automatically refetch হয় ✅
```

---

## 💻 Usage Examples (ব্যবহারের নমুনা)

### A. ডাটা লোড করা (Fetch)
```typescript
import { useGetUsersQuery } from '@/redux';

const UserList = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery({
    page: 1,
    limit: 10
  });

  // Auto-managed states:
  if (isLoading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div>ত্রুটি: {error.toString()}</div>;

  return (
    <div>
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
};
```

### B. ডাটা যোগ করা (Create)
```typescript
import { useCreateUserMutation } from '@/redux';

const AddUser = () => {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleAdd = async () => {
    try {
      const newUser = await createUser({
        name: 'আবু তালেব',
        email: 'abul@example.com',
        password: 'secure123'
      }).unwrap();  // Error handling built-in
      
      console.log('নতুন user:', newUser);
      // User list automatically আপডেট হবে
    } catch (error) {
      console.error('ত্রুটি:', error);
    }
  };

  return <button onClick={handleAdd}>User যোগ করুন</button>;
};
```

### C. ডাটা পরিবর্তন করা (Update)
```typescript
import { useUpdateUserMutation } from '@/redux';

const EditUser = ({ userId }: { userId: string }) => {
  const [updateUser] = useUpdateUserMutation();

  const handleUpdate = async () => {
    await updateUser({
      id: userId,
      data: { name: 'নতুন নাম' }
    }).unwrap();
  };

  return <button onClick={handleUpdate}>সংস্করণ করুন</button>;
};
```

### D. ডাটা মুছে ফেলা (Delete)
```typescript
import { useDeleteUserMutation } from '@/redux';

const DeleteButton = ({ userId }: { userId: string }) => {
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (confirm('মুছে ফেলুন?')) {
      await deleteUser(userId).unwrap();
      // List automatically আপডেট হবে
    }
  };

  return <button onClick={handleDelete}>মুছে ফেলুন</button>;
};
```

---

## 🎓 Advantages (সুবিধাসমূহ)

### 1. কম COding, বেশি Output
```typescript
// ❌ OLD WAY (React Query/Vanilla Redux)
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);

// ✅ NEW WAY (RTK Query)
const { data: users, isLoading, error } = useGetUsersQuery();
// সব অটোমেটিক!
```

### 2. Auto Caching
- Same request multiple times? → API call only once
- Data fresh? → Background refetch automatically

### 3. DevTools
- Redux DevTools এ সব API calls দেখতে পাবেন
- Request/Response inspect করতে পারবেন
- Cache management করতে পারবেন

### 4. Type Safety
```typescript
const { data } = useGetUsersQuery();
// data automatically typed as User[]
// Autocomplete পাবেন IDE তে
```

---

## 🚀 Quick Start (দ্রুত শুরু)

### 1. নতুন API endpoint যোগ করা
```typescript
// src/redux/services/orderApi.ts (নতুন file তৈরি করুন)
import { apiSlice } from './api';
import type { Order } from '../types';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
    }),
  }),
});

export const { useGetOrdersQuery } = orderApi;
```

### 2. Component এ ব্যবহার করা
```typescript
import { useGetOrdersQuery } from '@/redux';

const Orders = () => {
  const { data: orders } = useGetOrdersQuery();
  return <div>Orders: {orders?.length}</div>;
};
```

---

## ❓ FAQ (সাধারণ প্রশ্ন)

**Q: Token ক Bhatt stored হয়?**
A: Redux state এ (authSlice.ts) + localStorage এ backup হিসেবে

**Q: Cache ক Bhatt clear হয়?**
A: Mutation automatically invalidate করে respective tags কে

**Q: Server error হলে কী হয়?**
A: baseQueryWithReauth চেক করে 401 হলে logout handled করে

**Q: Manual refresh করতে该怎么办?**
A: `refetch()` function ব্যবহার করুন অথবা `dispatch(apiSlice.util.invalidateTags(['User']))`

---

## 📞 Support
RTK Query documentation: https://redux-toolkit.js.org/rtk-query/overview