# Admin Setup & Login Guide

## ✅ Environment Configuration Status

Your `.env.local` file is properly configured with all necessary credentials and settings.

## 🔐 Admin Login Credentials

**Login URL**: http://localhost:5002/login

**Credentials**:
- **Email**: `admin@kabirsantsharan.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password before production deployment!

## 📊 Database Status

### Cloudflare D1 Database
- **Database Name**: kabir-sant-sharan
- **Database ID**: cf50986b-cc78-4c0c-b6bd-268e6b8c44c5
- **Status**: ✅ Connected (Local development mode)

### Tables Created:
1. ✅ `blog_posts` - Teachings and spiritual content
2. ✅ `events` - Community events and satsangs
3. ✅ `quotes` - Daily wisdom quotes
4. ✅ `media_content` - Audio/video content
5. ✅ `user_profiles` - User management

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Admin Panel
1. Open browser: http://localhost:5002/login
2. Enter credentials above
3. Click "Sign In"
4. You'll be redirected to: http://localhost:5002/admin

### 3. Available Admin Features
- **Dashboard**: Analytics overview
- **Content Management**: Create/edit teachings
- **Event Management**: Manage satsangs and events
- **Media Manager**: Upload audio/video files
- **Newsletter**: Manage subscribers and campaigns
- **Analytics**: Track page views and visitors
- **Settings**: Configure system preferences

## 🔧 Environment Variables Configured

### JWT Configuration
```
JWT_SECRET=y87JEVGt7uL_6USZZL1MrHLuUCkfhfmOrcWqxang0C8
JWT_REFRESH_SECRET=fJeHp8UNaJNrtFWrQeI5G7BU8I6FztwSsVkZ4bFyneE
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### Admin Configuration
```
ADMIN_EMAIL=admin@kabirsantsharan.com
ADMIN_PASSWORD_HASH=$2b$12$NNnKjCgp2n1L2eYtLARZoOHYIrDfqMYyBgJFCFnTU6.zAlZsAGglO
```

### Security Settings
- **CORS Origins**: localhost:5002, kabirsantsharan.com
- **Bcrypt Salt Rounds**: 12
- **Rate Limiting**: Configured for auth and API endpoints

## 🧪 Testing the Setup

### Test Admin Login API
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kabirsantsharan.com",
    "password": "admin123"
  }'
```

Expected Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresAt": 1727654321000,
  "user": {
    "email": "admin@kabirsantsharan.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

### Test Database Connection
```bash
wrangler d1 execute kabir-sant-sharan --local --command "SELECT name FROM sqlite_master WHERE type='table';"
```

## 🔒 Security Checklist

- ✅ JWT secrets generated and configured
- ✅ Admin password hashed with bcrypt (12 rounds)
- ✅ CORS configured for allowed origins
- ✅ Rate limiting enabled (5 auth attempts/min)
- ✅ Content Security Policy configured
- ✅ XSS and CSRF protection enabled
- ⚠️ **TODO**: Change default admin password before production

## 📝 Admin Panel Pages

### Dashboard (`/admin`)
- Quick stats overview
- Recent activity
- System health indicators

### Content Management (`/admin/content`)
- Create new teachings
- Edit existing content
- Category management
- Featured content selection

### Event Management (`/admin/events`)
- Create upcoming events
- Manage registrations
- Virtual meeting links
- Event categories (Satsang, Meditation, Festival)

### Media Manager (`/admin/media`)
- Upload audio files
- Upload video content
- Image management
- Media library browser

### Newsletter (`/admin/newsletter`)
- View subscribers
- Create campaigns
- Send newsletters
- Manage preferences

### Analytics (`/admin/analytics`)
- Page view tracking
- Visitor statistics
- Popular content
- Search queries

### Settings (`/admin/settings`)
- Admin profile
- Password change
- System configuration
- Rate limiting settings

## 🐛 Troubleshooting

### Issue: Cannot login
**Solution**: Verify credentials and check browser console for errors

### Issue: Database not found
**Solution**: Run `wrangler d1 execute kabir-sant-sharan --local --file=drizzle/schema.sql`

### Issue: 401 Unauthorized
**Solution**: Clear browser cookies and try logging in again

### Issue: 500 Internal Server Error
**Solution**: Check `.env.local` exists and contains all required variables

## 🌐 Production Deployment

Before deploying to production:

1. **Change Admin Password**:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_SECURE_PASSWORD', 12));"
```

2. **Set Cloudflare Secrets**:
```bash
wrangler pages secret put JWT_SECRET
wrangler pages secret put JWT_REFRESH_SECRET
wrangler pages secret put ADMIN_PASSWORD_HASH
```

3. **Apply Schema to Production D1**:
```bash
wrangler d1 execute kabir-sant-sharan --remote --file=drizzle/schema.sql
```

4. **Deploy**:
```bash
git push origin main
# Cloudflare Pages will auto-deploy
```

## 📚 Additional Resources

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Next.js Documentation](https://nextjs.org/docs)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
**Status**: ✅ Ready for Testing