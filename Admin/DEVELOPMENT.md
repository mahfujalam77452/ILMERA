# Development Guidelines - ILMERA Admin Panel

## Code Style & Best Practices

### Component Structure

```jsx
// 1. Imports
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { IconName } from 'lucide-react'
import ComponentName from './path'

// 2. Component Definition
const MyComponent = () => {
  // 3. State
  const [state, setState] = useState(null)

  // 4. Effects
  useEffect(() => {
    // logic
  }, [])

  // 5. Event Handlers
  const handleAction = () => {
    // logic
  }

  // 6. Render
  return (
    // JSX
  )
}

// 7. Export
export default MyComponent
```

### Naming Conventions

- **Components**: PascalCase (`Dashboard.jsx`, `UserProfile.jsx`)
- **Functions**: camelCase (`handleSubmit`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_SIZE`)
- **Files**: PascalCase for components, lowercase for utilities
- **CSS Classes**: kebab-case (`btn-primary`, `form-label`)

### File Organization

```
src/
├── components/      # Reusable UI components
├── pages/          # Page-level components
├── services/       # API calls
├── context/        # React context
├── hooks/          # Custom hooks
└── utils/          # Helper functions
```

## API Integration

### Creating a New Service

```javascript
// src/services/index.js
export const newService = {
  getAll: async (params = {}) => {
    const response = await api.get("/endpoint", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/endpoint/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/endpoint", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/endpoint/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/endpoint/${id}`);
    return response.data;
  },
};
```

### Using Services in Components

```javascript
import { newService } from "../services";

const Data = await newService.getAll();
```

## Error Handling

Always handle API errors with try-catch and user feedback:

```javascript
try {
  const response = await apiCall();
  toast.success("Success message!");
} catch (error) {
  const message = error.response?.data?.error || "Operation failed";
  toast.error(message);
}
```

## Form Handling

### Form State Management

```javascript
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) {
    toast.error("Please fix errors");
    return;
  }

  // submit logic
};
```

### Validation

```javascript
const validateForm = () => {
  const newErrors = {};

  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!validations.isEmail(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Component Patterns

### Loading State

```javascript
if (loading && !data.length) {
  return <LoadingSpinner text="Loading data..." />;
}

if (data.length === 0) {
  return (
    <Card>
      <p>No data found</p>
    </Card>
  );
}

return <div>{/* content */}</div>;
```

### Pagination

```javascript
const [pagination, setPagination] = useState({
  current: 1,
  limit: 20,
  total: 0,
  pages: 1,
})

useEffect(() => {
  fetchData()
}, [pagination.current])

<Pagination
  currentPage={pagination.current}
  totalPages={pagination.pages}
  onPageChange={(page) => setPagination({ ...pagination, current: page })}
/>
```

### Modal Usage

```javascript
const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  title="Modal Title"
  onClose={() => setIsOpen(false)}
  footer={
    <>
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleAction}>Confirm</Button>
    </>
  }
>
  {/* Modal content */}
</Modal>
```

## Testing Checklist

Before committing code:

- [ ] Component renders without errors
- [ ] All API calls work correctly
- [ ] Form validation works
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Mobile responsive layout
- [ ] No console errors (F12)
- [ ] Toast notifications appear
- [ ] Keyboard navigation works (Tab key)

## Common Pitfalls

### 1. Missing Error Handling

❌ Bad:

```javascript
const data = await api.get("/endpoint");
```

✅ Good:

```javascript
try {
  const data = await api.get("/endpoint");
} catch (error) {
  toast.error("Failed to fetch");
}
```

### 2. Infinite Loops

❌ Bad:

```javascript
useEffect(() => {
  fetchData();
}, [data]); // data changes when data is fetched
```

✅ Good:

```javascript
useEffect(() => {
  fetchData();
}, []); // runs once on mount
```

### 3. Unhandled Async Promises

❌ Bad:

```javascript
useEffect(() => {
  asyncFunction(); // not handled
}, []);
```

✅ Good:

```javascript
useEffect(() => {
  const loadData = async () => {
    await asyncFunction();
  };
  loadData();
}, []);
```

### 4. Missing Cleanup

❌ Bad:

```javascript
const handleDelete = async () => {
  await deleteItem();
  // Try to setLoading after unmount
};
```

✅ Good:

```javascript
const handleDelete = async () => {
  try {
    setLoading(true);
    await deleteItem();
    toast.success("Deleted!");
  } finally {
    setLoading(false);
  }
};
```

## Performance Tips

### 1. Use Keys in Lists

```javascript
{
  items.map((item) => (
    <Card key={item._id}>{item.name}</Card> // Use unique ID
  ));
}
```

### 2. Memoize Components (if needed)

```javascript
export default React.memo(ExpensiveComponent);
```

### 3. Optimize Re-renders

```javascript
useCallback(myFunction, [dependencies]);
useMemo(() => complexCalculation(), [dependencies]);
```

### 4. Lazy Load Routes (if needed)

```javascript
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

## Accessibility (A11y)

- Use semantic HTML (`<button>`, `<form>`, etc.)
- Add `aria-label` for icon-only buttons
- Ensure color contrast meets WCAG AA standards
- Support keyboard navigation (Tab, Enter, Escape)
- Test with screen readers

```javascript
<button aria-label="Close modal" onClick={handleClose}>
  <X size={20} />
</button>
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/description` - Code refactoring

### Commit Messages

- Use imperative: "Add feature" not "Added feature"
- Be descriptive: "Add user authentication" not "Fix stuff"
- Keep it concise: Max 50 characters

### Example

```
feat: Add picture upload with validation
fix: Resolve pagination issue on volunteer list
refactor: Extract category form to reusable component
```

## Debugging Tips

### 1. React DevTools

- Install React DevTools browser extension
- Inspect component props and state
- Check component re-renders

### 2. Network Debugging

- F12 > Network tab
- Monitor API requests and responses
- Check response headers for CORS issues

### 3. Local Storage Inspection

```javascript
console.log(localStorage.getItem("adminToken"));
localStorage.clear(); // Clear all
```

### 4. Debug API Calls

```javascript
console.log("Request:", { url, data });
console.log("Response:", response.data);
```

## Resources

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)
- [Lucide React Icons](https://lucide.dev)

---

**Last Updated:** February 10, 2026
