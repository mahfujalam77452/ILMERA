# ILMERA Backend - Quick Reference

## 🚀 Start Server

```bash
npm run dev    # Development with auto-reload
npm start      # Production mode
```

## 📊 Database Models Summary

| Model         | Required Fields                              | Special Features                  |
| ------------- | -------------------------------------------- | --------------------------------- |
| **Admin**     | email, password                              | Hashed password, unique email     |
| **Category**  | category                                     | Unique category name              |
| **Picture**   | category, picture_link                       | Cloudinary integration            |
| **Video**     | video_link, title                            | -                                 |
| **Activity**  | title, pictures_link_list, description       | Unique title, multiple images     |
| **Blog**      | date, title, pictures_link_list, description | Unique title, multiple images     |
| **Volunteer** | 25+ fields, picture_link                     | Unique email & mobile, Cloudinary |
| **Donation**  | date, amount, category                       | Stripe integration                |
| **Contact**   | -                                            | Single document, all optional     |

## 🔐 Authentication Flow

1. **Login** → Get JWT Token

```
POST /api/admin/login
Body: { email, password }
Returns: { token, admin }
```

2. **Use Token** → Add to Headers

```
Authorization: Bearer <token>
```

3. **Token Expires** → Relogin in 24 hours

## 📸 Image Upload Flow

1. **Upload to Frontend** → Multipart form
2. **Backend Receives** → Via Multer
3. **Upload to Cloudinary** → Auto organized
4. **Save URL** → Store in database
5. **Delete Record** → Auto-delete from Cloudinary

## 💳 Stripe Payment Flow

1. **Create Donation** → Get client_secret
2. **Frontend Confirms** → Stripe SDK
3. **Payment Processed** → Stripe charges
4. **Webhook Fires** → Backend validates
5. **Status Updated** → Database record updated

## 🔍 Query & Filtering

### Pagination (All list endpoints)

```
GET /api/endpoint?page=1&limit=20
```

### Donation Filters

```
GET /api/donations
  ?page=1
  &limit=20
  &status=success              # pending, success, failed
  &fromDate=2024-01-01        # ISO format
  &toDate=2024-12-31
  &name=John                   # Fuzzy search
  &phone_email=john@mail.com  # Fuzzy search
  &category=Education
```

## 🛣️ Route List (36+ endpoints)

### Admin Routes

```
POST   /api/admin/login                 (public)
POST   /api/admin/update-password       (admin)
```

### Category Routes

```
GET    /api/categories                  (public)
POST   /api/categories                  (admin)
DELETE /api/categories/:id              (admin)
```

### Picture Routes

```
GET    /api/pictures?page=1&limit=20   (public, paginated)
POST   /api/pictures                    (admin, multipart)
DELETE /api/pictures/:id                (admin)
```

### Video Routes

```
GET    /api/videos                      (public, paginated)
POST   /api/videos                      (admin, JSON)
DELETE /api/videos/:id                  (admin)
```

### Activity Routes

```
GET    /api/activities                  (public, paginated)
POST   /api/activities                  (admin, multipart)
DELETE /api/activities/:id              (admin)
```

### Blog Routes

```
GET    /api/blogs                       (public, paginated)
POST   /api/blogs                       (admin, multipart)
DELETE /api/blogs/:id                   (admin)
```

### Volunteer Routes

```
POST   /api/volunteers                  (public, multipart, rate-limited)
GET    /api/volunteers                  (admin, paginated)
PATCH  /api/volunteers/:id/member       (admin)
DELETE /api/volunteers/:id              (admin)
```

### Contact Routes

```
GET    /api/contact                     (public)
PATCH  /api/contact                     (admin, JSON)
```

### Donation Routes

```
POST   /api/donations                   (public, JSON, rate-limited)
GET    /api/donations                   (admin, paginated, filterable)
PATCH  /api/donations/:id/status        (admin)
```

### Stripe Routes

```
POST   /api/stripe/webhook              (Stripe)
```

## 🔧 Common Tasks

### Get Admin Token

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ilmera.com","password":"admin@123"}'
```

### Add Category

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category":"Education"}'
```

### Upload Picture

```bash
curl -X POST http://localhost:5000/api/pictures \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "category=CATEGORY_ID"
```

### Submit Volunteer Form

```bash
curl -X POST http://localhost:5000/api/volunteers \
  -F "picture=@/path/to/image.jpg" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "mobile=01712345678" \
  [... other fields]
```

### Create Donation

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "name": "John Donor",
    "phone_email": "john@example.com",
    "category": "Education"
  }'
```

### Query Donations

```bash
curl "http://localhost:5000/api/donations?page=1&status=success&category=Education" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ❌ Common Error Codes

| Code  | Issue        | Fix                                        |
| ----- | ------------ | ------------------------------------------ |
| 400   | Bad Request  | Check request format/required fields       |
| 401   | Unauthorized | Add valid JWT token in headers             |
| 404   | Not Found    | Check if resource exists                   |
| 500   | Server Error | Check logs, verify configuration           |
| 11000 | Duplicate    | Item already exists (email, mobile, title) |

## 📝 Response Format

### Success (200/201)

```json
{
  "success": true,
  "message": "Operation description",
  "data": {
    /* response data */
  }
}
```

### Error (400/401/404/500)

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    /* detailed error */
  }
}
```

## 🎯 Rate Limits

- **Volunteer Submit**: 10 requests per 15 minutes (per IP)
- **Donation Create**: 20 requests per 15 minutes (per IP)
- **Other**: No limit

## 🗂️ File Structure

- Models → Database schemas
- Controllers → Business logic
- Routes → Endpoint definitions
- Middleware → Request processors (auth, validation)
- Utils → Helper functions (Cloudinary, Stripe, JWT)
- Config → Configuration (Database)

## 🔄 Data Flow

```
Request → Middleware (Auth/Validation)
       → Route Handler
       → Controller (Business Logic)
       → Database Model (MongoDB)
       → Response (Formatted JSON)
```

## 💾 Middleware Chain

1. **Error Handler** - Catches exceptions
2. **Auth** - JWT verification (if required)
3. **Validation** - Request body validation
4. **Upload** - File processing (if needed)
5. **Controller** - Business logic

## 📦 Key Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cloudinary` - Image management
- `stripe` - Payment processing
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `joi` - Data validation
- `express-rate-limit` - Rate limiting
- `multer` - File uploads
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `dotenv` - Environment variables

## ⚡ Performance Tips

- Pagination default 20, max 100 (prevents large queries)
- Images auto-optimized by Cloudinary
- Latest-first sorting for better UX
- Rate limiting prevents abuse
- JWT tokens valid 24 hours
- MongoDB indices on frequently queried fields

## 🚨 Important Notes

- Default admin auto-created on first run
- Images stored in organized Cloudinary folders
- All models have timestamps (createdAt, updatedAt)
- Volunteer email & mobile are unique
- Activity & Blog titles are unique
- Stripe webhook signature verification required
- CORS must be configured for frontend domain

---

**Ready to build! Happy coding! 🎉**
