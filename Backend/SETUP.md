# ILMERA Backend - Quick Start Guide

## ✅ Project Status

Your complete ILMERA backend is now ready! All files and configurations have been created.

## 📁 Project Structure

````
Backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/              # Business logic (10 controllers)
│   │   ├── adminController.js
│   │   ├── categoryController.js
│   │   ├── pictureController.js
│   │   ├── videoController.js
│   │   ├── activityController.js
│   │   ├── blogController.js
│   │   ├── volunteerController.js
│   │   ├── contactController.js
│   │   ├── donationController.js
│   │   └── [more...]
│   ├── middleware/               # Custom middleware
│   │   ├── authenticate.js       # JWT auth
│   │   └── validation.js         # Request validation
│   ├── models/                   # Mongoose schemas (9 models)
│   │   ├── Admin.js
│   │   ├── Category.js
│   │   ├── Picture.js
│   │   ├── Video.js
│   │   ├── Activity.js
│   │   ├── Blog.js
│   │   ├── Volunteer.js
│   │   ├── Donation.js
│   │   └── Contact.js
│   ├── routes/                   # API routes (11 route files)
│   │   ├── adminRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── [more...]
│   │   └── webhookRoutes.js
│   ├── utils/                    # Utility functions
│   │   ├── cloudinary.js         # Image upload/delete
│   │   ├── stripe.js             # Payment processing
│   │   ├── jwt.js                # Token generation
│   │   ├── response.js           # Response formatting
│   │   └── errorHandler.js       # Error handling
│   └── index.js                  # Main server file
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── README.md                     # Full documentation
├── SETUP.md                      # This file
└── POSTMAN_COLLECTION.json       # API testing collection

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd Backend
npm install
````

### Step 2: Create .env File

Copy the example and add your configuration:

```bash
cp .env.example .env
```

Edit `.env` with:

- MongoDB URI
- JWT Secret
- Cloudinary credentials
- Stripe keys

### Step 3: Create Uploads Directory

```bash
mkdir uploads
```

### Step 4: Start Development Server

```bash
npm run dev
```

Server will run on: **http://localhost:5000**

## 🔑 Default Admin Credentials

- Email: `admin@ilmera.com`
- Password: `admin@123`

**Change these in production!**

## 📚 Complete API Documentation

### 36+ API Endpoints

**Admin APIs (require authorization):**

- Login / Password Update
- CRUD operations for: Categories, Pictures, Videos, Activities, Blogs
- Volunteer management (view, set member, delete)
- Donation management (query with filters)
- Contact management (update)

**Public APIs:**

- Get categories, pictures, videos, activities, blogs
- Get contact information
- Submit volunteer form
- Create donation

## 🔒 Environment Variables Required

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ilmera
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=24h

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

ADMIN_EMAIL=admin@ilmera.com
ADMIN_PASSWORD=admin@123

NODE_ENV=development
```

## 📋 Key Features Implemented

✅ **Authentication**

- JWT token-based admin authentication
- 24-hour token expiry
- Password hashing with bcryptjs

✅ **Image Management**

- Cloudinary integration
- Automatic image optimization
- Image deletion on record removal
- Organized folder structure

✅ **Payment Processing**

- Stripe PaymentIntent creation
- Webhook handling for payment confirmation
- Donation status tracking

✅ **Data Management**

- 9 database models with validations
- Email and mobile uniqueness
- Unique titles for activities and blogs
- Timestamp tracking (createdAt, updatedAt)

✅ **API Features**

- Pagination support (default 20, max 100)
- Latest-first sorting
- Rate limiting on public endpoints
- Comprehensive error handling
- Uniform response format

✅ **Database**

- MongoDB with Mongoose ODM
- Automatic index creation
- Data validation

## 📖 API Testing

### Using Postman

1. Import `POSTMAN_COLLECTION.json` into Postman
2. Set `BASE_URL` variable to `http://localhost:5000`
3. Use **Admin Login** endpoint to get token
4. Set `TOKEN` variable with received token
5. Test all other endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ilmera.com","password":"admin@123"}'

# Get Categories
curl http://localhost:5000/api/categories
```

## 🌐 Deployment (Vercel)

1. **Create vercel.json** in root

```json
{
  "builds": [{ "src": "src/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.js" }]
}
```

2. **Deploy**

```bash
npm install -g vercel
vercel
```

3. **Add Environment Variables** in Vercel dashboard

4. **Update Webhook URL** in Stripe dashboard

## 🐛 Troubleshooting

### MongoDB Connection Failed

- Ensure MongoDB is running
- Check MONGODB_URI in .env

### Cloudinary Upload Failed

- Verify API credentials
- Check image size (max 10MB)

### Stripe Webhook Not Working

- Verify webhook secret matches
- Check endpoint URL in Stripe dashboard

### JWT Errors

- Token may be expired (24 hours)
- Login again to get new token

## 📞 Support Features

- Error logging with details
- Validation error messages per field
- Comprehensive error responses
- Health check endpoint: GET `/api/health`

## ✨ Next Steps

1. **Configure Cloudinary**
   - Create account at cloudinary.com
   - Get API credentials

2. **Setup Stripe**
   - Create account at stripe.com
   - Configure webhook endpoint

3. **Setup MongoDB**
   - Local: Install MongoDB
   - Cloud: Use MongoDB Atlas

4. **Default Admin**
   - Auto-created on first run
   - Change password immediately

5. **Deploy**
   - Use Vercel for easy deployment
   - Configure environment variables

## 🎯 Production Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Verify Cloudinary setup
- [ ] Test Stripe webhook
- [ ] Enable HTTPS
- [ ] Setup rate limiting for all endpoints
- [ ] Configure CORS for frontend domain
- [ ] Enable error logging
- [ ] Setup monitoring

## 📚 Additional Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- Cloudinary: https://cloudinary.com/documentation
- Stripe: https://stripe.com/docs
- JWT: https://jwt.io/

---

**Your backend is ready! Start building amazing things! 🎉**
