# ILMERA Project - Complete Setup Guide

This guide covers the complete setup of ILMERA frontend admin panel.

## Project Overview

ILMERA is a comprehensive web platform for managing:

- 📁 Organization content (activities, blogs, videos, galleries)
- 🎥 Multimedia management (YouTube integration, image uploads)
- 🙋 Volunteer management (recruitment, member tracking)
- 💳 Donation tracking and management
- 📞 Contact information management

## System Requirements

### For Development

- Node.js 16+ and npm/yarn
- Git
- Code editor (VS Code recommended)
- Modern web browser

### For Deployment

- Server/hosting platform (Linux recommended)
- Node.js 16+ (if running backend on same server)
- Nginx or Apache for reverse proxy
- SSL certificate (HTTPS)
- MongoDB (for backend)

## Quick Start (3 Steps)

### 1. Backend Setup

```bash
cd Backend
npm install
# Configure .env with database URL
npm run dev
# Backend will run on http://localhost:5000
```

### 2. Admin Panel Setup

```bash
cd Admin
npm install
# .env is already configured for localhost
npm run dev
# Admin panel will open at http://localhost:3000
```

### 3. Login

Open http://localhost:3000 and login:

- **Email:** admin@ilmera.com
- **Password:** admin@123

---

## Detailed Setup Instructions

### Backend Setup

#### 1. Navigate to Backend Directory

```bash
cd Backend
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment

Create a `.env` file in Backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost/ilmera
ADMIN_EMAIL=admin@ilmera.com
ADMIN_PASSWORD=admin@123
JWT_SECRET=your-secret-key-here
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
NODE_ENV=development
```

#### 4. Start Backend

```bash
npm run dev
```

Expected output:

```
✅ Default admin created
🚀 Server running on port 5000
📝 Admin Email: admin@ilmera.com
```

#### 5. Verify Backend

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"Server is running"}
```

### Admin Panel Setup

#### 1. Navigate to Admin Directory

```bash
cd Admin
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Verify Configuration

Check `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
```

Change if backend is on different URL/port.

#### 4. Start Development Server

```bash
npm run dev
```

Expected output:

```
VITE v5.0.0  ready in 234 ms
➜  Local:   http://localhost:3000/
```

#### 5. Access Admin Panel

- Open http://localhost:3000 in browser
- Login with credentials above
- Dashboard should load with statistics

---

## Features Walkthrough

### 1. Dashboard

- View content statistics
- Quick overview of all modules
- Recent activity summary

**How to access:** Just log in, you're on the dashboard

### 2. Categories

- Create content categories
- Used by pictures and activities
- Delete categories

**Steps:**

1. Click "Categories" in sidebar
2. Click "Add Category" button
3. Enter category name
4. Click "Add Category"

### 3. Pictures

- Upload and organize pictures by category
- Gallery view

**Steps:**

1. Click "Pictures" in sidebar
2. Click "Add Picture" button
3. Select category from dropdown
4. Choose image file (JPEG, PNG, GIF, WebP, max 10MB)
5. Click "Add Picture"

### 4. Videos

- Add YouTube videos
- Auto-embed preview

**Steps:**

1. Click "Videos" in sidebar
2. Click "Add Video" button
3. Enter video title
4. Paste YouTube URL (will validate)
5. Click "Add Video"

### 5. Activities

- Complex projects with multiple details
- Up to 5 images per activity
- YouTube video embedding
- Structured content (goals, beneficiaries, etc.)

**Steps:**

1. Click "Activities" in sidebar
2. Click "Add Activity" button
3. Fill in basic info (title, summary)
4. Upload images (max 5)
5. Add YouTube video link (optional)
6. Add description paragraphs
7. Add goals, beneficiaries, expense categories
8. Fill project details (area, duration)
9. Click "Add Activity"

### 6. Blogs

- Blog posts with publication date
- Multiple images per blog
- Rich content

**Steps:**

1. Click "Blogs" in sidebar
2. Click "Add Blog" button
3. Enter title and publication date
4. Upload images (max 5)
5. Add content paragraphs
6. Click "Add Blog"

### 7. Volunteer Requests

- Review new volunteer applications
- Accept or delete requests

**Steps:**

1. Click "Volunteer Requests" in sidebar
2. Review volunteer information
3. Click "Details" to expand full info
4. Click "Accept" to add to members
5. Click "Delete" to reject request

### 8. Volunteer List

- View approved volunteers
- Search by name, phone, or district
- View detailed information

**Steps:**

1. Click "Volunteer List" in sidebar
2. Select search field (name, phone, district)
3. Enter search query
4. View up to 100 approved volunteers
5. Expand card to see full details

### 9. Donations

- View all donations with detailed information
- Filter by date range, status, donor
- Export for reporting

**Steps:**

1. Click "Donations" in sidebar
2. Set date range (optional)
3. Select status filter (optional)
4. Search by donor name or contact (optional)
5. View donation table
6. Use pagination to browse

### 10. Contacts

- Edit organization contact information
- Manage social media links
- Update address and phone

**Steps:**

1. Click "Contacts" in sidebar
2. Click "Edit" button
3. Update desired fields
4. Click "Save Changes"

### 11. Change Password

- Update admin password securely

**Steps:**

1. Click profile icon (top right)
2. Select "Change Password"
3. Enter old password
4. Enter new password (min 6 chars)
5. Confirm new password
6. Click "Change Password"

---

## Troubleshooting

### Login Issues

**Problem:** "Invalid credentials" error

- Verify default admin exists in backend
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`
- Ensure backend is running

**Solution:**

```bash
# Backend logs should show:
✅ Default admin created
```

### API Connection Issues

**Problem:** "Failed to fetch" or network errors

- Backend may not be running
- Wrong API URL in admin `.env`
- CORS issues

**Debug:**

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check admin API URL
cat Admin/.env | grep VITE_API_BASE_URL
```

### File Upload Issues

**Problem:** Upload fails silently

- File too large (max 10MB)
- Wrong format (must be JPEG, PNG, GIF, WebP)
- Category not selected (for pictures)

**Solution:**

- Compress image (use online tools)
- Convert to supported format
- Always select category first for pictures

### Session Timeout

**Problem:** Logged out unexpectedly

- Backend token expired
- Browser localStorage cleared
- HTTPS/HTTP mismatch in production

**Solution:**

- Log in again
- Check browser security settings
- Use HTTPS in production

## Building for Production

### Frontend Build

```bash
cd Admin
npm run build

# Output will be in dist/ folder
# Upload this folder to your web server
```

### Deployment Checklist

- [ ] Backend environment variables configured
- [ ] Frontend API URL points to production backend
- [ ] HTTPS enabled
- [ ] Admin credentials changed
- [ ] Database backups enabled
- [ ] Error monitoring set up (optional)
- [ ] Security headers configured

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete production setup.

---

## File Structure

```
ILMERA/
├── Admin/                           # Admin Panel Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
│
├── Backend/                         # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── README.md                        # This file
```

---

## Commands Reference

### Backend

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm test          # Run tests
npm run lint      # Run linter
```

### Admin Panel

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

---

## Environment Variables

### Backend (.env)

| Variable                | Required | Default          | Purpose                |
| ----------------------- | -------- | ---------------- | ---------------------- |
| `PORT`                  | No       | 5000             | Server port            |
| `MONGODB_URI`           | Yes      | -                | Database connection    |
| `ADMIN_EMAIL`           | No       | admin@ilmera.com | Default admin email    |
| `ADMIN_PASSWORD`        | No       | admin@123        | Default admin password |
| `JWT_SECRET`            | Yes      | -                | JWT signing secret     |
| `CLOUDINARY_NAME`       | Yes      | -                | Image upload service   |
| `CLOUDINARY_API_KEY`    | Yes      | -                | Image upload service   |
| `CLOUDINARY_API_SECRET` | Yes      | -                | Image upload service   |
| `STRIPE_SECRET_KEY`     | Yes      | -                | Payment processing     |

### Admin Panel (.env)

| Variable            | Required | Default                   | Purpose           |
| ------------------- | -------- | ------------------------- | ----------------- |
| `VITE_API_BASE_URL` | No       | http://localhost:5000/api | Backend API URL   |
| `VITE_API_TIMEOUT`  | No       | 30000                     | API timeout in ms |

---

## Security Best Practices

1. **Change Default Credentials**
   - Update admin email and password before production

2. **Use HTTPS**
   - Enable SSL/TLS encryption
   - Use Let's Encrypt for free certificates

3. **Environment Variables**
   - Never commit `.env` file to git
   - Use `.env.example` as template
   - Different values for each environment

4. **JWT Security**
   - Use strong `JWT_SECRET`
   - Set appropriate token expiration
   - Refresh tokens securely

5. **API Security**
   - Enable CORS properly
   - Rate limiting on endpoints
   - Input validation and sanitization
   - SQL injection/NoSQL injection prevention

6. **Database**
   - Regular backups
   - Authentication enabled
   - Network access restricted
   - Encryption at rest (if sensitive data)

---

## Performance Tips

- Enable Gzip compression on server
- Configure browser caching headers
- Use CDN for static assets
- Optimize images before upload
- Database indexing on frequently queried fields
- Monitor API response times

---

## Support & Maintenance

### Getting Help

1. Check relevant README.md files
2. Review error messages in browser console (F12)
3. Check backend logs
4. Check browser Network tab for API responses

### Reporting Issues

When reporting bugs, include:

- Screenshots of the error
- Browser console errors (F12)
- Steps to reproduce
- Expected vs actual behavior

### Updates

- Check repository for updates regularly
- Test updates in development first
- Backup before major updates

---

## Next Steps

1. **Complete Setup** - Follow "Quick Start" above
2. **Test Features** - Try all major features
3. **Customize** - Modify colors, branding, etc.
4. **Deploy** - Follow DEPLOYMENT.md
5. **Monitor** - Set up logging and monitoring
6. **Maintain** - Regular backups and updates

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Axiosio Docs](https://axios-http.com)
- [React Router Docs](https://reactrouter.com)
- [MongoDB Documentation](https://docs.mongodb.com)

---

## Version History

| Version | Date         | Changes         |
| ------- | ------------ | --------------- |
| 1.0.0   | Feb 10, 2026 | Initial release |

---

**Last Updated:** February 10, 2026

**Project Status:** ✅ Ready for Production

---

**Questions? Review the documentation files or check the code comments!** 🚀
