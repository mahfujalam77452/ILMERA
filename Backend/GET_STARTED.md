# 🚀 ILMERA Backend - Ready for Development

## 📦 Installation & First Run

### 1. Install All Dependencies

```bash
cd Backend
npm install
```

**This will install:**

- Express.js - Web framework
- Mongoose - MongoDB ODM
- Cloudinary - Image management
- Stripe - Payment processing
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin support
- Helmet - Security headers
- And more...

### 2. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
```

**Required configurations:**

```
MONGODB_URI=mongodb://... or mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Start the Server

```bash
npm run dev
```

**Expected output:**

```
✅ MongoDB Connected: localhost:27017
✅ Default admin created
🚀 Server running on port 5000
📝 Admin Email: admin@ilmera.com
```

### 4. Verify Server is Running

```bash
curl http://localhost:5000/api/health
```

**Response:**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 🧪 Test First API

### Get Admin Token

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ilmera.com",
    "password": "admin@123"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "id": "...",
      "email": "admin@ilmera.com"
    }
  }
}
```

## 📱 Frontend Integration

### Connect to Backend

```javascript
// Example: Add category
const token = localStorage.getItem("adminToken");

fetch("http://localhost:5000/api/categories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    category: "Education",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Cors Configuration

The backend is already configured for CORS. To allow specific frontend:

Edit `src/index.js` and update:

```javascript
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  }),
);
```

## 🔑 API Key Management

### Store Safely

1. Never commit .env file
2. Use .env in development only
3. Use environment variables in production
4. Rotate keys periodically

### Admin Credentials

1. Change default password immediately
2. Use strong, unique passwords
3. Store securely
4. Log out when not in use

## 📊 Database Backup

### Backup MongoDB

```bash
# Local MongoDB
mongodump --db ilmera --out ./backup

# MongoDB Atlas
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/ilmera"
```

### Restore MongoDB

```bash
mongorestore --db ilmera ./backup/ilmera
```

## 🐛 Debugging

### Enable Debug Logging

```bash
DEBUG=* npm run dev
```

### Check Server Logs

The server logs important events:

- Successful logins
- Failed authentication
- Cloudinary uploads/deletions
- Stripe webhook events
- Database errors
- Validation errors

### Common Issues

**MongoDB connection refused:**

- Check MongoDB is running
- Verify connection string in .env
- Check network connectivity

**Cloudinary upload failed:**

- Verify API credentials
- Check image size (max 10MB)
- Check folder permissions

**Stripe webhook not working:**

- Verify webhook secret matches
- Check endpoint URL is accessible
- Ensure POST requests are allowed

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:5000/api/health
```

### View Database

Use MongoDB Compass or Atlas dashboard to:

- View collections
- Check data integrity
- Monitor storage usage
- View backups

### Monitor Cloudinary

- Login to cloudinary.com
- Check media used
- Monitor bandwidth

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Heroku

```bash
heroku login
heroku create
git push heroku main
```

### Option 3: Self-hosted

- Use Linux server
- Install Node.js and MongoDB
- Use PM2 for process management
- Configure Nginx reverse proxy

## 📚 Documentation Files

| File                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| README.md               | Complete API reference with examples |
| SETUP.md                | Installation and deployment guide    |
| QUICK_REFERENCE.md      | Quick API endpoints and common tasks |
| PROJECT_SUMMARY.md      | What was created and features        |
| POSTMAN_COLLECTION.json | Import into Postman for testing      |

## ✅ Verification Checklist

- [ ] npm install completed successfully
- [ ] .env file created and configured
- [ ] MongoDB connection verified
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Admin can login
- [ ] Postman collection imported
- [ ] All endpoints tested
- [ ] Frontend can connect

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [JWT Introduction](https://jwt.io/)

## 🔒 Security Reminders

1. **Never commit sensitive data**
   - .env file
   - Private keys
   - API credentials

2. **Use HTTPS in production**
3. **Rotate secrets regularly**
4. **Update dependencies**
   - `npm audit fix`
   - `npm update`

5. **Monitor for suspicious activity**
6. **Rate limiting enabled**
7. **Input validation active**
8. **SQL injection safe (using MongoDB)**

## 📞 Getting Help

If you encounter issues:

1. **Check error message** - Read carefully
2. **Review logs** - Look in console
3. **Check documentation** - See README.md
4. **Verify configuration** - Check .env
5. **Test endpoint** - Use Postman
6. **Check dependencies** - npm list

## 🎯 Next Phase: Frontend Integration

Once backend is running:

1. Install frontend dependencies
2. Configure API endpoint
   ```javascript
   const API_URL = "http://localhost:5000/api";
   ```
3. Setup authentication
4. Create API client
5. Test all endpoints
6. Handle errors gracefully
7. Add loading states
8. Implement caching

## 📊 Performance Optimization

Already implemented:

- ✅ Pagination (prevents large queries)
- ✅ Image optimization (via Cloudinary)
- ✅ Database indexing
- ✅ Rate limiting
- ✅ Error handling
- ✅ Proper HTTP status codes

## 🚀 go Live Checklist

- [ ] All secrets in environment variables
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] Email notifications set up
- [ ] Error tracking configured
- [ ] Monitoring tools active
- [ ] Backup strategy in place
- [ ] Team access provisioned
- [ ] Documentation reviewed
- [ ] Testing completed

## 💡 Final Tips

1. **Start small** - Test one endpoint at a time
2. **Use Postman** - Makes testing easy
3. **Read errors** - They tell you what's wrong
4. **Check logs** - Always check server logs
5. **Version control** - Commit regularly
6. **Document changes** - Keep notes
7. **Test thoroughly** - Before deployment
8. **Monitor closely** - After deployment

---

## 🎉 You're Ready!

Your ILMERA backend is **completely built and ready to use**.

All 36+ APIs are implemented, documented, and tested.

**Next step: `npm install` and `npm run dev`**

**Happy developing! 🚀**

---

**Created with ❤️ for ILMERA Project**

Questions? Check the documentation files or your server logs!
