# Quick Start Guide - ILMERA Admin Panel

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd Admin
npm install
```

### Step 2: Configure Backend URL

Edit `.env` file (or create from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start the App

```bash
npm run dev
```

### Step 4: Login

Open `http://localhost:3000` and login with:

- Email: `admin@ilmera.com`
- Password: `admin@123`

---

## 📁 Using the Admin Panel

### Dashboard

- Overview of all content statistics
- Quick access to all sections

### Categories

- Add new categories for organizing content
- Delete categories (cannot have associated content)

### Pictures

- Upload pictures by category
- Each upload requires category selection
- View gallery and delete pictures

### Videos

- Add YouTube videos with title
- Automatic URL validation
- Embedded preview before saving

### Activities

- Create complex activities with:
  - Multiple images (up to 5)
  - YouTube video
  - Multiple paragraphs of content
  - Project goals, beneficiaries, expenses
  - Project area and duration

### Blogs

- Create blog posts with:
  - Title and publication date
  - Multiple images (up to 5)
  - Multiple paragraphs of content

### Volunteers

- **Requests Tab**: Review new volunteers, accept or reject
- **Members Tab**: View approved volunteers, search by name/phone/district

### Donations

- View all donations with filters
- Filter by date range, status, and donor name
- Export data for reporting

### Contacts

- Edit organization's contact information
- Manage social media profiles
- Update office location and contact details

---

## 🔑 Admin Account Management

### Change Password

1. Click profile icon (top right)
2. Select "Change Password"
3. Enter old and new password
4. Confirm changes

### Logout

1. Click profile icon
2. Select "Logout"

---

## 🚀 Production Deployment

### Build the App

```bash
npm run build
```

### Deploy to Server

1. Upload contents of `dist/` folder to your web server
2. Configure backend API URL in `.env` or server environment
3. Set HTTPS and secure headers

### Environment Setup

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

---

## 🛠️ Troubleshooting

**Q: Cannot login**

- Ensure backend is running on port 5000
- Check credentials are correct
- Clear browser cache/localStorage

**Q: Cannot upload images**

- Check file size (max 10MB)
- Verify file format (JPEG, PNG, GIF, WebP)
- Select category before uploading

**Q: API errors**

- Check `VITE_API_BASE_URL` in `.env`
- Verify backend server is running
- Check browser console for CORS errors

---

## 📚 API Reference

See [Backend API Documentation](../Backend/ADMIN_PANEL_API_DOCUMENTATION.md) for complete API details.

## 💡 Tips

- All forms validate input before submission
- Toast notifications show success/error messages
- Search and filters work in real-time
- Pagination limits large datasets
- Images are stored on Cloudinary

---

**Need help?** Check the full README.md for detailed documentation.
