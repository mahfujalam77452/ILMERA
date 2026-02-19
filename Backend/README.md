# ILMERA Backend API Documentation

A comprehensive Node.js/Express backend for the ILMERA volunteer management and donation system with Stripe integration.

## 🚀 Features

- **Admin Authentication**: JWT-based authentication with 24-hour expiry
- **Image Management**: Cloudinary integration for automatic image storage and management
- **Payment Processing**: Stripe integration with webhook support
- **Data Management**: Full CRUD operations for all models
- **Rate Limiting**: Applied to public endpoints to prevent abuse
- **Comprehensive Logging**: Important events logged with proper error handling
- **Responsive API**: Pagination and sorting support for all list endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account

## 🔧 Installation & Setup

1. **Clone and navigate to the backend folder**

   ```bash
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ilmera
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h

   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret

   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   ADMIN_EMAIL=admin@ilmera.com
   ADMIN_PASSWORD=admin@123
   ```

5. **Create uploads directory**

   ```bash
   mkdir uploads
   ```

6. **Start the server**
   ```bash
   npm run dev  # Development with auto-reload
   npm start    # Production
   ```

## 📚 API Endpoints

### Admin Authentication (Public)

#### Login

- **POST** `/api/admin/login`
- **Body**: `{ email, password }`
- **Returns**: Access token

#### Update Password

- **POST** `/api/admin/update-password`
- **Auth**: Required (Bearer token)
- **Body**: `{ oldPassword, newPassword }`

### Categories (Public Get, Admin Post/Delete)

- **GET** `/api/categories` - Get all categories
- **POST** `/api/categories` - Add category (Admin only)
  - **Body**: `{ category }`
- **DELETE** `/api/categories/:id` - Delete category (Admin only)

### Pictures (Public Get, Admin Post/Delete)

- **GET** `/api/pictures?page=1&limit=20` - Get all pictures with pagination
- **POST** `/api/pictures` - Add picture (Admin only)
  - **Form**: Multipart form with `image` file and `category` ID
- **DELETE** `/api/pictures/:id` - Delete picture (Admin only)

### Videos (Public Get, Admin Post/Delete)

- **GET** `/api/videos?page=1&limit=20` - Get all videos
- **POST** `/api/videos` - Add video (Admin only)
  - **Body**: `{ video_link, title }`
- **DELETE** `/api/videos/:id` - Delete video (Admin only)

### Activities (Public Get, Admin Post/Delete)

- **GET** `/api/activities?page=1&limit=20` - Get all activities
- **POST** `/api/activities` - Add activity (Admin only)
  - **Form**: Multipart form with `images` files, `title`, `description` (JSON), etc.
- **DELETE** `/api/activities/:id` - Delete activity (Admin only)

### Blogs (Public Get, Admin Post/Delete)

- **GET** `/api/blogs?page=1&limit=20` - Get all blogs
- **POST** `/api/blogs` - Add blog (Admin only)
  - **Form**: Multipart form with `images` files, `title`, `date`, `description` (JSON)
- **DELETE** `/api/blogs/:id` - Delete blog (Admin only)

### Volunteers (Public Post, Admin Get/Update/Delete)

- **POST** `/api/volunteers` - Submit volunteer form (Public, rate-limited)
  - **Form**: Multipart form with all volunteer fields
- **GET** `/api/volunteers?page=1&limit=20` - Get all volunteers (Admin only)
- **PATCH** `/api/volunteers/:id/member` - Set as member (Admin only)
- **DELETE** `/api/volunteers/:id` - Delete volunteer (Admin only)

### Contact (Public Get, Admin Update)

- **GET** `/api/contact` - Get contact information
- **PATCH** `/api/contact` - Update contact (Admin only)
  - **Body**: Contact fields (phone, email, facebook, etc.)

### Donations (Public Create, Admin Get/Query)

- **POST** `/api/donations` - Create donation (Public, rate-limited)
  - **Body**: `{ amount, name, phone_email, category }`
  - **Returns**: Donation object with `client_secret` for Stripe
- **GET** `/api/donations?page=1&limit=20&status=success` - Get donations (Admin only)
  - **Query Filters**:
    - `fromDate`: Date range start (ISO format)
    - `toDate`: Date range end
    - `name`: Donor name (fuzzy search)
    - `phone_email`: Phone or email (fuzzy search)
    - `category`: Donation category
    - `status`: pending|success|failed (default: success)
- **PATCH** `/api/donations/:id/status` - Update donation status (Admin only)

### Stripe Webhook

- **POST** `/api/stripe/webhook` - Stripe event handler
  - **Handles**: payment_intent.succeeded, payment_intent.payment_failed

## 📊 Database Models

### Admin

```
- email (unique, required)
- password (hashed, required)
```

### Category

```
- category (unique, required)
```

### Picture

```
- category (reference to Category)
- picture_link (required)
- cloudinary_public_id
```

### Video

```
- video_link (required)
- title (required)
```

### Activity

```
- title (unique, required)
- summary
- pictures_link_list (array)
- cloudinary_public_ids (array)
- video_link
- project_goals (array)
- beneficiaries (array)
- expense_categories (array)
- project_area
- duration
- description (array of strings)
```

### Blog

```
- date (required)
- title (unique, required)
- pictures_link_list (array)
- cloudinary_public_ids (array)
- description (array of strings)
```

### Volunteer

```
- name (required)
- father_name (required)
- mobile (unique, required)
- email (unique, required)
- [25+ other location and education fields]
- picture_link (required)
- cloudinary_public_id
- is_member (default: false)
```

### Donation

```
- date (required)
- amount (required)
- name
- phone_email
- category (required)
- payment_status (pending|success|failed)
- stripe_payment_intent_id
- stripe_charge_id
- payment_timestamp
```

### Contact

```
- phone
- location
- email
- facebook
- youtube
- linkedin
- whatsapp
```

## 🔒 Security Features

- **JWT Authentication**: 24-hour session tokens
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Applied to volunteer submissions and donations
- **CORS**: Properly configured
- **Helmet**: Security headers included
- **Environment Variables**: Sensitive data in .env file
- **Input Validation**: Joi validation for request bodies
- **Cloudinary Deletion**: Images deleted on record removal

## 📋 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

## 🔄 Pagination

All list endpoints support:

- `page`: Current page (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes:

```json
{
  "data": [...],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 💳 Stripe Payment Flow

1. **Create Donation**: POST `/api/donations` returns `client_secret`
2. **Confirm Payment**: Frontend uses Stripe SDK with `client_secret`
3. **Webhook Confirmation**: Stripe sends webhook to `/api/stripe/webhook`
4. **Database Update**: Donation status updated automatically

## 🚀 Deployment (Vercel)

1. Install Vercel CLI: `npm install -g vercel`
2. Configure: `vercel env add` for environment variables
3. Deploy: `vercel deploy`
4. Update webhook URL in Stripe dashboard

## 📝 Notes

- Default admin credentials are set from .env file on first run
- Images stored in Cloudinary with organized folder structure
- All timestamps managed by Mongoose (createdAt, updatedAt)
- Latest items returned first (sorted by createdAt: -1)
- Volunteer and donation submissions are rate-limited
- All admin APIs require valid JWT token

## 🤝 Support

For issues or questions, please check the API response messages and error details.
