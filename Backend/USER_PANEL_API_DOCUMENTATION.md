# USER PANEL API DOCUMENTATION

## Base URL

```
http://localhost:5000/api
```

---

## 2. VOLUNTEER MANAGEMENT APIs

### 2.1 Add/Register Volunteer

**Endpoint:** `POST /volunteer`

**Authentication:** None (Public) - Rate Limited (10 requests per 15 minutes)

**Request Type:** Multipart Form Data

**Request Body:**

```
Fields:
- picture: File (required, image file, max 10MB)
- name: String (required)
- father_name: String (required)
- mobile: String (required, unique)
- email: String (required, unique, valid email format)
- current_occupation: String (required)
- workplace_name: String (optional)
- workplace_address: String (optional)
- current_division: String (required)
- current_district: String (required)
- current_upazila: String (required)
- current_union: String (required)
- current_full_address: String (required)
- permanent_division: String (required)
- permanent_district: String (required)
- permanent_upazila: String (required)
- permanent_union: String (required)
- permanent_full_address: String (required)
- facebook_profile: String (optional)
- linkedIn_profile: String (optional)
- whatsapp_number: String (optional)
- telegram_number: String (optional)
- medium_of_study: String (required)
- education_level: String (required)
- passing_class: String (required)
- department: String (optional)
- name_of_educational_institution: String (optional)

Maximum Fields: 28 fields
```

**Response Body (Success - 201):**

```json
{
  "success": true,
  "message": "Volunteer added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "father_name": "Jane Doe",
    "mobile": "01700000000",
    "email": "john@example.com",
    "current_occupation": "Student",
    "workplace_name": "University",
    "workplace_address": "Dhaka",
    "current_division": "Dhaka",
    "current_district": "Dhaka",
    "current_upazila": "Gulshan",
    "current_union": "Mohakhali",
    "current_full_address": "123 Main St, Gulshan",
    "permanent_division": "Dhaka",
    "permanent_district": "Dhaka",
    "permanent_upazila": "Gulshan",
    "permanent_union": "Mohakhali",
    "permanent_full_address": "123 Main St, Gulshan",
    "facebook_profile": "https://facebook.com/johndoe",
    "linkedIn_profile": "https://linkedin.com/in/johndoe",
    "whatsapp_number": "01700000000",
    "telegram_number": "@johndoe",
    "medium_of_study": "Bangla",
    "education_level": "Bachelor",
    "passing_class": "Class 12",
    "department": "Computer Science",
    "name_of_educational_institution": "BUET",
    "picture_link": "https://cloudinary.com/images/...",
    "cloudinary_public_id": "volunteers/...",
    "is_member": false,
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T10:00:00.000Z"
  }
}
```

**Response Body (Error - 400):**

```json
{
  "success": false,
  "error": "Email or mobile number already registered"
}
```

---

---

## 3. DONATION MANAGEMENT APIs

### 3.1 Create Donation

**Endpoint:** `POST /donation`

**Authentication:** None (Public) - Rate Limited (20 requests per 15 minutes)

**Request Body:**

```json
{
  "amount": 5000,
  "name": "John Doe",
  "phone_email": "john@example.com",
  "category": "Education"
}
```

**Maximum Fields:** 4 fields

**Response Body (Success - 201):**

```json
{
  "success": true,
  "message": "Donation initiated, please complete payment",
  "data": {
    "donation": {
      "_id": "507f1f77bcf86cd799439011",
      "date": "2026-02-10T10:00:00.000Z",
      "amount": 5000,
      "name": "John Doe",
      "phone_email": "john@example.com",
      "category": "Education",
      "payment_status": "pending",
      "stripe_payment_intent_id": "pi_1234567890",
      "stripe_charge_id": null,
      "payment_timestamp": null,
      "createdAt": "2026-02-10T10:00:00.000Z",
      "updatedAt": "2026-02-10T10:00:00.000Z"
    },
    "client_secret": "pi_1234567890_secret_abcdef123"
  }
}
```

---

---

## 4. BLOG MANAGEMENT APIs


### 4.2 Get All Blogs

**Endpoint:** `GET /blog?page=1&limit=20`

**Authentication:** None (Public)

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Records per page

**Response Body (Success - 200):**

```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": {
    "blogs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Blog Title",
        "date": "2026-02-10T00:00:00.000Z",
        "pictures_link_list": ["https://cloudinary.com/images/..."],
        "cloudinary_public_ids": ["blogs/abc123"],
        "description": ["First paragraph"],
        "createdAt": "2026-02-10T10:00:00.000Z",
        "updatedAt": "2026-02-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 30,
      "pages": 2
    }
  }
}
```

---

## 5. CATEGORY MANAGEMENT APIs

---

### 5.2 Get All Categories

**Endpoint:** `GET /category?page=1&limit=20`

**Authentication:** None (Public)

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Records per page

**Response Body (Success - 200):**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "category": "Education",
        "createdAt": "2026-02-10T10:00:00.000Z",
        "updatedAt": "2026-02-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 10,
      "pages": 1
    }
  }
}
```

---


---

## 6. ACTIVITY MANAGEMENT APIs


### 6.2 Get All Activities

**Endpoint:** `GET /activity?page=1&limit=20`

**Authentication:** None (Public)

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Records per page

**Response Body (Success - 200):**

```json
{
  "success": true,
  "message": "Activities retrieved successfully",
  "data": {
    "activities": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Community Activity",
        "summary": "Activity summary",
        "video_link": "https://youtube.com/...",
        "project_goals": ["Goal 1"],
        "beneficiaries": ["Group A"],
        "expense_categories": ["Category 1"],
        "project_area": "Dhaka",
        "duration": "3 months",
        "pictures_link_list": ["https://cloudinary.com/images/..."],
        "cloudinary_public_ids": ["activities/abc123"],
        "description": ["Paragraph 1"],
        "createdAt": "2026-02-10T10:00:00.000Z",
        "updatedAt": "2026-02-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

## 7. PICTURE MANAGEMENT APIs

---

### 7.2 Get All Pictures

**Endpoint:** `GET /picture?page=1&limit=20&category=507f1f77bcf86cd799439012`

**Authentication:** None (Public)

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20, max: 100) - Records per page
- `category` (optional) - Filter by Category ID

**Response Body (Success - 200):**

```json
{
  "success": true,
  "message": "Pictures retrieved successfully",
  "data": {
    "pictures": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "category": {
          "_id": "507f1f77bcf86cd799439012",
          "category": "Education",
          "createdAt": "2026-02-10T10:00:00.000Z",
          "updatedAt": "2026-02-10T10:00:00.000Z"
        },
        "picture_link": "https://cloudinary.com/images/...",
        "cloudinary_public_id": "pictures/abc123",
        "createdAt": "2026-02-10T10:00:00.000Z",
        "updatedAt": "2026-02-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  }
}
```

---


## 8. CONTACT INFORMATION APIs

### 8.1 Get Contact Information

**Endpoint:** `GET /contact`

**Authentication:** None (Public)

**Response Body (Success - 200):**

```json
{
  "success": true,
  "message": "Contact retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "phone": "+880-123-456-7890",
    "location": "Dhaka, Bangladesh",
    "email": "contact@ilmera.com",
    "facebook": "https://facebook.com/ilmera",
    "youtube": "https://youtube.com/ilmera",
    "linkedin": "https://linkedin.com/company/ilmera",
    "whatsapp": "+880-123-456-7890",
    "createdAt": "2026-02-10T10:00:00.000Z",
    "updatedAt": "2026-02-10T10:00:00.000Z"
  }
}
```

---


---

## COMMON ERROR RESPONSES

### 400 Bad Request

```json
{
  "success": false,
  "error": "Field-specific error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "No token provided" or "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## AUTHENTICATION TOKEN

All authenticated endpoints require:

```
Authorization: Bearer <token>
```

Token is provided after successful login. Token should be stored in localStorage/sessionStorage and sent with every authenticated request.

---

---

3. **Handle Pagination:** Implement pagination in list views
4. **Image Upload:** Use FormData for multipart requests
5. **Error Handling:** Check `success` field and handle specific error messages
6. **Date Format:** Use ISO 8601 format for dates (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
7. **JSON Parsing:** Some fields in request bodies are JSON strings (description, project_goals, etc.)
