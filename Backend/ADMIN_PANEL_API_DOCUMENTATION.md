# ILMERA Admin Panel API Documentation

## Overview

Complete API documentation for the ILMERA Admin Panel. This guide provides all endpoints, request/response formats, and authentication requirements needed to develop your frontend admin panel.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Admin Authentication](#admin-authentication)
3. [Category Management](#category-management)
4. [Activity Management](#activity-management)
5. [Blog Management](#blog-management)
6. [Picture Management](#picture-management)
7. [Video Management](#video-management)
8. [Volunteer Management](#volunteer-management)
9. [Donation Management](#donation-management)
10. [Contact Information](#contact-information)
11. [Error Responses](#error-responses)

---

## Base Configuration

### **Base URL**

```
http://localhost:YOUR_PORT
```

or your deployed URL

### **Authentication**

All admin endpoints (except login) require the `Authorization` header with JWT token:

```
Authorization: Bearer <token>
```

### **Default Credentials**

```
Email: admin@ilmera.com
Password: admin@123
```

---

## Admin Authentication

### **1.1 Admin Login**

**Method:** `POST`  
**Endpoint:** `/api/admin/login`  
**Authentication:** No

**Request Body:**

```json
{
  "email": "admin@ilmera.com",
  "password": "admin@123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "admin_id",
      "email": "admin@ilmera.com"
    }
  },
  "message": "Login successful"
}
```

**Error (401):**

```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

---

### **1.2 Update Admin Password**

**Method:** `POST`  
**Endpoint:** `/api/admin/update-password`  
**Authentication:** **Required** ✓

**Request Body:**

```json
{
  "oldPassword": "admin@123",
  "newPassword": "newPassword@123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Password updated successfully"
}
```

**Error (401):**

```json
{
  "success": false,
  "error": "Old password is incorrect",
  "statusCode": 401
}
```

---

## Category Management

### **2.1 Add Category**

**Method:** `POST`  
**Endpoint:** `/api/category`  
**Authentication:** **Required** ✓

**Request Body:**

```json
{
  "category": "Education"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "Education",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Category added successfully"
}
```

**Error (400):**

```json
{
  "success": false,
  "error": "Category already exists",
  "statusCode": 400
}
```

---

### **2.2 Get All Categories**

**Method:** `GET`  
**Endpoint:** `/api/category`  
**Authentication:** No

**Query Parameters:** None

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "category": "Education",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "category": "Healthcare",
      "createdAt": "2024-01-14T09:20:00Z"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

---

### **2.3 Delete Category**

**Method:** `DELETE`  
**Endpoint:** `/api/category/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Category ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Category deleted successfully"
}
```

**Error (404):**

```json
{
  "success": false,
  "error": "Category not found",
  "statusCode": 404
}
```

---

## Activity Management

### **3.1 Add Activity**

**Method:** `POST`  
**Endpoint:** `/api/activity`  
**Authentication:** **Required** ✓  
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | Yes | Activity title |
| `summary` | String | No | Brief summary |
| `description` | String | Yes | Detailed description (JSON string) |
| `video_link` | String | No | YouTube or video URL |
| `project_goals` | String | No | JSON array of goals |
| `beneficiaries` | String | No | JSON array of beneficiaries |
| `expense_categories` | String | No | JSON array of expense categories |
| `project_area` | String | No | Geographic area |
| `duration` | String | No | Project duration |
| `images` | File[] | Yes | 1-5 image files (JPEG, PNG, GIF, WebP, Max 10MB each) |

**Example Form Data:**

```
title: "School Renovation Project"
summary: "Renovating ABC School"
video_link: "https://youtube.com/watch?v=..."
project_goals: '["Goal 1", "Goal 2"]'
beneficiaries: '["Students", "Teachers"]'
expense_categories: '["Materials", "Labor"]'
project_area: "Dhaka"
duration: "3 months"
description: '{"en": "Description text"}'
images: [file1, file2, file3]
```

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "School Renovation Project",
    "summary": "Renovating ABC School",
    "pictures_link_list": [
      "https://res.cloudinary.com/...",
      "https://res.cloudinary.com/..."
    ],
    "cloudinary_public_ids": ["activities/id1", "activities/id2"],
    "video_link": "https://youtube.com/watch?v=...",
    "project_goals": ["Goal 1", "Goal 2"],
    "beneficiaries": ["Students", "Teachers"],
    "expense_categories": ["Materials", "Labor"],
    "project_area": "Dhaka",
    "duration": "3 months",
    "description": { "en": "Description text" },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Activity added successfully"
}
```

---

### **3.2 Get All Activities**

**Method:** `GET`  
**Endpoint:** `/api/activity`  
**Authentication:** No

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | Integer | 1 | - |
| `limit` | Integer | 20 | 100 |

**Example Request:**

```
GET /api/activity?page=1&limit=20
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "title": "School Renovation Project",
        "summary": "Renovating ABC School",
        "pictures_link_list": ["url1", "url2"],
        "cloudinary_public_ids": ["id1", "id2"],
        "video_link": "https://youtube.com/watch?v=...",
        "project_goals": ["Goal 1", "Goal 2"],
        "beneficiaries": ["Students", "Teachers"],
        "expense_categories": ["Materials", "Labor"],
        "project_area": "Dhaka",
        "duration": "3 months",
        "description": { "en": "Description text" },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "message": "Activities retrieved successfully"
}
```

---

### **3.3 Delete Activity**

**Method:** `DELETE`  
**Endpoint:** `/api/activity/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Activity ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Activity deleted successfully"
}
```

---

## Blog Management

### **4.1 Add Blog**

**Method:** `POST`  
**Endpoint:** `/api/blog`  
**Authentication:** **Required** ✓  
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `date` | String | Yes | ISO date format (e.g., "2024-01-15") |
| `title` | String | Yes | Blog post title |
| `description` | String | Yes | Blog content (JSON string) |
| `images` | File[] | Yes | 1-5 image files (JPEG, PNG, GIF, WebP, Max 10MB each) |

**Example Form Data:**

```
date: "2024-01-15"
title: "Blog Post Title"
description: '{"en": "Blog content text here"}'
images: [file1, file2]
```

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Blog Post Title",
    "date": "2024-01-15T00:00:00Z",
    "pictures_link_list": [
      "https://res.cloudinary.com/...",
      "https://res.cloudinary.com/..."
    ],
    "cloudinary_public_ids": ["blogs/id1", "blogs/id2"],
    "description": { "en": "Blog content text here" },
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Blog added successfully"
}
```

---

### **4.2 Get All Blogs**

**Method:** `GET`  
**Endpoint:** `/api/blog`  
**Authentication:** No

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | Integer | 1 | - |
| `limit` | Integer | 20 | 100 |

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "blogs": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "title": "Blog Post Title",
        "date": "2024-01-15T00:00:00Z",
        "pictures_link_list": ["url1", "url2"],
        "cloudinary_public_ids": ["id1", "id2"],
        "description": { "en": "Blog content text here" },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 30,
      "pages": 2
    }
  },
  "message": "Blogs retrieved successfully"
}
```

---

### **4.3 Delete Blog**

**Method:** `DELETE`  
**Endpoint:** `/api/blog/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Blog ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Blog deleted successfully"
}
```

---

## Picture Management

### **5.1 Add Picture**

**Method:** `POST`  
**Endpoint:** `/api/picture`  
**Authentication:** **Required** ✓  
**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `category` | String | Yes | Category ID (MongoDB ObjectId) |
| `image` | File | Yes | Single image file (JPEG, PNG, GIF, WebP, Max 10MB) |

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "category": {
      "_id": "507f1f77bcf86cd799439011",
      "category": "Education"
    },
    "picture_link": "https://res.cloudinary.com/...",
    "cloudinary_public_id": "pictures/id1",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Picture added successfully"
}
```

---

### **5.2 Get All Pictures**

**Method:** `GET`  
**Endpoint:** `/api/picture`  
**Authentication:** No

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | Integer | 1 | - |
| `limit` | Integer | 20 | 100 |

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "pictures": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "category": {
          "_id": "507f1f77bcf86cd799439011",
          "category": "Education"
        },
        "picture_link": "https://res.cloudinary.com/...",
        "cloudinary_public_id": "pictures/id1",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "message": "Pictures retrieved successfully"
}
```

---

### **5.3 Delete Picture**

**Method:** `DELETE`  
**Endpoint:** `/api/picture/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Picture ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Picture deleted successfully"
}
```

---

## Video Management

### **6.1 Add Video**

**Method:** `POST`  
**Endpoint:** `/api/video`  
**Authentication:** **Required** ✓  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "title": "Video Title",
  "video_link": "https://youtube.com/watch?v=..."
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "title": "Video Title",
    "video_link": "https://youtube.com/watch?v=...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Video added successfully"
}
```

---

### **6.2 Get All Videos**

**Method:** `GET`  
**Endpoint:** `/api/video`  
**Authentication:** No

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | Integer | 1 | - |
| `limit` | Integer | 20 | 100 |

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "title": "Video Title",
        "video_link": "https://youtube.com/watch?v=...",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  },
  "message": "Videos retrieved successfully"
}
```

---

### **6.3 Delete Video**

**Method:** `DELETE`  
**Endpoint:** `/api/video/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Video ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Video deleted successfully"
}
```

---

## Volunteer Management

### **7.1 Get All Volunteers**

**Method:** `GET`  
**Endpoint:** `/api/volunteer`  
**Authentication:** **Required** ✓

**Query Parameters:**
| Parameter | Type | Default | Max |
|-----------|------|---------|-----|
| `page` | Integer | 1 | - |
| `limit` | Integer | 20 | 100 |

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "volunteers": [
      {
        "_id": "507f1f77bcf86cd799439017",
        "name": "John Doe",
        "father_name": "Mr. Doe",
        "mobile": "+880123456789",
        "email": "john@example.com",
        "current_occupation": "Software Engineer",
        "workplace_name": "Tech Company",
        "workplace_address": "Dhaka",
        "current_division": "Dhaka",
        "current_district": "Dhaka",
        "current_upazila": "Gulshan",
        "current_union": "Gulshan",
        "current_full_address": "Full address here",
        "permanent_division": "Dhaka",
        "permanent_district": "Dhaka",
        "permanent_upazila": "Gulshan",
        "permanent_union": "Gulshan",
        "permanent_full_address": "Full address here",
        "facebook_profile": "https://facebook.com/...",
        "linkedIn_profile": "https://linkedin.com/...",
        "whatsapp_number": "+880123456789",
        "telegram_number": "@john_doe",
        "medium_of_study": "Online",
        "education_level": "Bachelor's",
        "passing_class": "2020",
        "department": "Computer Science",
        "name_of_educational_institution": "University Name",
        "picture_link": "https://res.cloudinary.com/...",
        "cloudinary_public_id": "volunteers/id1",
        "is_member": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 75,
      "pages": 4
    }
  },
  "message": "Volunteers retrieved successfully"
}
```

---

### **7.2 Set Volunteer as Member**

**Method:** `PATCH`  
**Endpoint:** `/api/volunteer/:id/member`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Volunteer ID (MongoDB ObjectId)

**Request Body:** Empty (or {})

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "+880123456789",
    "is_member": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Volunteer member status updated"
}
```

---

### **7.3 Delete Volunteer**

**Method:** `DELETE`  
**Endpoint:** `/api/volunteer/:id`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Volunteer ID (MongoDB ObjectId)

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {},
  "message": "Volunteer deleted successfully"
}
```

---

## Donation Management

### **8.1 Get All Donations**

**Method:** `GET`  
**Endpoint:** `/api/donation`  
**Authentication:** **Required** ✓

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Integer | Page number (default: 1) | 1 |
| `limit` | Integer | Records per page (default: 20, max: 100) | 20 |
| `fromDate` | String | Filter from date (ISO format) | "2024-01-01" |
| `toDate` | String | Filter to date (ISO format) | "2024-01-31" |
| `name` | String | Search by donor name (case-insensitive) | "John" |
| `phone_email` | String | Search by phone/email (case-insensitive) | "john@example.com" |
| `category` | String | Filter by donation category | "Education" |
| `status` | String | Filter by payment status | "success" / "pending" / "failed" |

**Example Request:**

```
GET /api/donation?page=1&limit=20&status=success&fromDate=2024-01-01&toDate=2024-01-31
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "donations": [
      {
        "_id": "507f1f77bcf86cd799439018",
        "date": "2024-01-15T10:30:00Z",
        "amount": 5000,
        "name": "Donor Name",
        "phone_email": "donor@example.com",
        "category": "Education",
        "payment_status": "success",
        "stripe_payment_intent_id": "pi_1234567890",
        "stripe_charge_id": "ch_1234567890",
        "payment_timestamp": "2024-01-15T10:35:00Z",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 120,
      "pages": 6
    }
  },
  "message": "Donations retrieved successfully"
}
```

---

### **8.2 Update Donation Status**

**Method:** `PATCH`  
**Endpoint:** `/api/donation/:id/status`  
**Authentication:** **Required** ✓

**URL Parameters:**

- `id` - Donation ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "payment_status": "success",
  "stripe_charge_id": "ch_1234567890"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439018",
    "amount": 5000,
    "payment_status": "success",
    "stripe_charge_id": "ch_1234567890",
    "payment_timestamp": "2024-01-15T10:35:00Z",
    "name": "Donor Name",
    "email": "donor@example.com",
    "category": "Education"
  },
  "message": "Donation status updated"
}
```

---

## Contact Information

### **9.1 Get Contact Information**

**Method:** `GET`  
**Endpoint:** `/api/contact`  
**Authentication:** No

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "phone": "+880123456789",
    "location": "Dhaka, Bangladesh",
    "email": "info@ilmera.com",
    "facebook": "https://facebook.com/ilmera",
    "youtube": "https://youtube.com/@ilmera",
    "linkedin": "https://linkedin.com/company/ilmera",
    "whatsapp": "+880987654321",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Contact retrieved successfully"
}
```

---

### **9.2 Update Contact Information**

**Method:** `PATCH`  
**Endpoint:** `/api/contact`  
**Authentication:** **Required** ✓

**Request Body (All fields optional - update only what you need):**

```json
{
  "phone": "+880123456789",
  "location": "Dhaka, Bangladesh",
  "email": "contact@ilmera.com",
  "facebook": "https://facebook.com/ilmera",
  "youtube": "https://youtube.com/@ilmera",
  "linkedin": "https://linkedin.com/company/ilmera",
  "whatsapp": "+880987654321"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439019",
    "phone": "+880123456789",
    "location": "Dhaka, Bangladesh",
    "email": "contact@ilmera.com",
    "facebook": "https://facebook.com/ilmera",
    "youtube": "https://youtube.com/@ilmera",
    "linkedin": "https://linkedin.com/company/ilmera",
    "whatsapp": "+880987654321",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Contact updated successfully"
}
```

---

## Error Responses

### **400 - Bad Request**

```json
{
  "success": false,
  "error": "Email and password are required",
  "statusCode": 400
}
```

### **401 - Unauthorized / Invalid Credentials**

```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

### **404 - Not Found**

```json
{
  "success": false,
  "error": "Category not found",
  "statusCode": 404
}
```

### **500 - Internal Server Error**

```json
{
  "success": false,
  "error": "Internal server error message",
  "statusCode": 500
}
```

---

## Implementation Notes

### **Image Upload Guidelines**

- **Supported Formats:** JPEG, PNG, GIF, WebP
- **Maximum File Size:** 10MB per file
- **Multiple Images:** Up to 5 images for Activities and Blogs
- **Single Image:** Pictures and Volunteer profiles accept single images
- **Storage:** Images are uploaded to Cloudinary and URLs are returned

### **Rate Limiting**

- **Volunteer Submissions:** 10 requests per 15 minutes per IP
- **Donations:** 20 requests per 15 minutes per IP

### **Pagination**

- Default limit: 20 records
- Maximum limit: 100 records
- All list endpoints return pagination metadata

### **Data Format**

- Dates should be in ISO 8601 format (e.g., "2024-01-15")
- JSON strings in form data should be properly stringified
- Timestamps are returned in UTC (ISO 8601 format)

### **Cloudinary Integration**

- All images are stored in Cloudinary
- Public IDs are maintained for future deletion
- Image URLs are permanently accessible from Cloudinary CDN

---

## Quick API Reference

| Feature                | Method | Endpoint                     | Auth? |
| ---------------------- | ------ | ---------------------------- | ----- |
| Admin Login            | POST   | `/api/admin/login`           | No    |
| Update Password        | POST   | `/api/admin/update-password` | Yes   |
| Add Category           | POST   | `/api/category`              | Yes   |
| Get Categories         | GET    | `/api/category`              | No    |
| Delete Category        | DELETE | `/api/category/:id`          | Yes   |
| Add Activity           | POST   | `/api/activity`              | Yes   |
| Get Activities         | GET    | `/api/activity`              | No    |
| Delete Activity        | DELETE | `/api/activity/:id`          | Yes   |
| Add Blog               | POST   | `/api/blog`                  | Yes   |
| Get Blogs              | GET    | `/api/blog`                  | No    |
| Delete Blog            | DELETE | `/api/blog/:id`              | Yes   |
| Add Picture            | POST   | `/api/picture`               | Yes   |
| Get Pictures           | GET    | `/api/picture`               | No    |
| Delete Picture         | DELETE | `/api/picture/:id`           | Yes   |
| Add Video              | POST   | `/api/video`                 | Yes   |
| Get Videos             | GET    | `/api/video`                 | No    |
| Delete Video           | DELETE | `/api/video/:id`             | Yes   |
| Get Volunteers         | GET    | `/api/volunteer`             | Yes   |
| Set Member Status      | PATCH  | `/api/volunteer/:id/member`  | Yes   |
| Delete Volunteer       | DELETE | `/api/volunteer/:id`         | Yes   |
| Get Donations          | GET    | `/api/donation`              | Yes   |
| Update Donation Status | PATCH  | `/api/donation/:id/status`   | Yes   |
| Get Contact            | GET    | `/api/contact`               | No    |
| Update Contact         | PATCH  | `/api/contact`               | Yes   |

---

## Testing the APIs

### **Using Postman:**

1. Import the POSTMAN_COLLECTION.json from the project root
2. Set the Bearer token in the Authorization tab for authenticated requests
3. Use the pre-configured requests to test all endpoints

### **Using cURL:**

```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ilmera.com","password":"admin@123"}'

# Get Categories (with token)
curl -X GET http://localhost:5000/api/category \
  -H "Authorization: Bearer <your_token>"
```

---

**Last Updated:** February 10, 2026  
**Version:** 1.0  
**Generated for:** ILMERA Admin Panel Frontend Development
