# ILMERA Admin Panel - Frontend

A modern, production-ready React admin panel for managing ILMERA organization's content, donations, volunteers, and more.

## Features

✅ **Authentication**

- JWT-based login system
- Change password functionality
- Secure session management

✅ **Content Management**

- Categories management
- Picture gallery management
- Video management (YouTube integration)
- Activities management with multiple images, videos, and details
- Blog management with rich content

✅ **Volunteer Management**

- Pending volunteer requests review
- Volunteer membership approval
- Volunteer list with advanced search
- Contact information display

✅ **Donation Tracking**

- View all donations
- Filter by date range and status
- Search by donor name or contact
- Payment status tracking

✅ **Contact Management**

- Edit organization contact information
- Manage social media links
- Centralized communication settings

✅ **UI/UX**

- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Loading skeletons and spinners
- Toast notifications for user feedback
- Confirm dialogs for destructive actions

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Vite** - Build tool

## Prerequisites

- Node.js 16+ installed
- Backend server running (port 5000 by default)
- Modern web browser

## Installation & Setup

### 1. Install Dependencies

```bash
cd Admin
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the Admin folder (copy from `.env.example`):

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=ILMERA Admin Panel
VITE_APP_VERSION=1.0.0
```

Update `VITE_API_BASE_URL` if your backend runs on a different URL.

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will open at `http://localhost:3000`

## Default Credentials

```
Email: admin@ilmera.com
Password: admin@123
```

**⚠️ Change these credentials immediately in production!**

## Project Structure

```
Admin/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Categories.jsx
│   │   ├── Pictures.jsx
│   │   ├── Videos.jsx
│   │   ├── Activities.jsx
│   │   ├── Blogs.jsx
│   │   ├── VolunteerRequests.jsx
│   │   ├── VolunteerList.jsx
│   │   ├── Contacts.jsx
│   │   ├── Donations.jsx
│   │   └── ChangePassword.jsx
│   ├── services/            # API services
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   └── index.js         # All API services
│   ├── context/             # React context
│   │   └── AuthContext.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js
│   ├── utils/               # Utility functions
│   │   ├── youtubeUtils.js
│   │   ├── validations.js
│   │   └── constants.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features & Implementation

### 1. Authentication

- Login with email and password
- JWT token stored in localStorage
- Automatic token injection in API requests
- Protected routes with redirect to login on 401
- Change password feature

### 2. Categories

- Add new categories
- Delete categories
- Pagination support

### 3. Pictures

- Select category before upload
- Single image upload per request
- Cloudinary integration for storage
- Gallery view with delete option
- Pagination support

### 4. Videos

- YouTube URL validation
- Embedded video preview
- Add title and URL
- Delete videos
- Pagination support

### 5. Activities

- Multiple image uploads (up to 5)
- YouTube video embedding
- Rich content with multiple paragraphs
- Project goals and objectives
- Beneficiaries tracking
- Expense categories
- Project area and duration
- Expandable cards for details

### 6. Blogs

- Multiple image uploads (up to 5)
- Publication date management
- Rich content with paragraphs
- Expandable blog cards
- Pagination support

### 7. Volunteers

- **Volunteer Requests**: Review pending volunteers with accept/delete options
- **Volunteer List**: Search by name, phone, or district
- Expandable details view with comprehensive information
- Limit to 100 members by default

### 8. Donations

- Advanced filtering (date range, status, search)
- Search by donor name or phone/email
- Filter by payment status (success, pending, failed)
- Responsive table layout
- Pagination support

### 9. Contacts

- Edit organization contact details
- Social media links management
- Email and phone management
- Edit mode with save/cancel

## API Integration

All API calls are centralized in the `src/services/` directory:

```javascript
// Example: Add a category
import { categoryService } from "../services";

const response = await categoryService.add("New Category Name");
```

### JWT Authentication

The axios instance automatically:

1. Reads token from localStorage
2. Adds Authorization header to requests
3. Redirects to login on 401 response

```javascript
// Authorization: Bearer <token>
```

## Form Handling & Validation

All forms include:

- Input validation
- Error message display
- Disabled states during submission
- Form reset after success

```javascript
// Example validation
if (!validations.isEmail(email)) {
  errors.email = "Invalid email format";
}
```

## File Upload Handling

- Validates file type (JPEG, PNG, GIF, WebP)
- Checks file size (max 10MB)
- Shows preview before upload
- Supports multiple files for activities and blogs
- Uses FormData for multipart upload

## Error Handling

All API errors are handled with:

- Toast notifications
- User-friendly error messages
- Fallback messages for unknown errors
- Loading states during operations

```javascript
catch (error) {
  const message = error.response?.data?.error || 'Operation failed'
  toast.error(message)
}
```

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Build Configuration

- Minified code
- Source maps enabled
- Code splitting for React
- Optimized chunk sizes

## Environment Variables

| Variable            | Default                     | Description              |
| ------------------- | --------------------------- | ------------------------ |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API URL          |
| `VITE_API_TIMEOUT`  | `30000`                     | API request timeout (ms) |
| `VITE_APP_NAME`     | `ILMERA Admin Panel`        | Application name         |
| `VITE_APP_VERSION`  | `1.0.0`                     | Application version      |

## Customization

### Theme Colors

Modify in `tailwind.config.js`:

```javascript
colors: {
  primary: '#3b82f6',
  secondary: '#10b981',
  danger: '#ef4444',
}
```

### API Timeout

Change in `.env`:

```
VITE_API_TIMEOUT=60000  // 60 seconds
```

## Troubleshooting

### API Connection Issues

- Check if backend server is running on port 5000
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### File Upload Fails

- Verify file size is under 10MB
- Ensure file format is supported (JPEG, PNG, GIF, WebP)
- Check browser's file upload permissions

### Session Expired

- Check localStorage.adminToken exists
- Verify token expiration on backend
- Clear localStorage and login again

### Styles Not Applied

- Run `npm install` to ensure dependencies
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- Efficient API calls
- Pagination for large datasets
- Debounced search

## Security Best Practices

✅ JWT token in localStorage
✅ Protected routes with authentication checks
✅ HTTPS recommended for production
✅ Environment variables for sensitive data
✅ Input validation on client and server
✅ CORS configured on backend

## Future Enhancements

- [ ] Offline mode with service workers
- [ ] Export data to CSV/PDF
- [ ] Bulk operations (delete multiple items)
- [ ] Advanced analytics dashboard
- [ ] Image optimization before upload
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Activity/audit logs

## Support & Documentation

For API documentation, see: [Backend API Documentation](../Backend/ADMIN_PANEL_API_DOCUMENTATION.md)

## License

Proprietary - All rights reserved to ILMERA

## Version

Current Version: **1.0.0**
Last Updated: February 10, 2026

---

**Happy coding! 🚀**
