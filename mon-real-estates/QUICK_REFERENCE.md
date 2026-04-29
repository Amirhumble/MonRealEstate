# Quick Reference Card - MonRealEstate Platform

## 🚀 Quick Start

```bash
# Start Backend
cd backend && npm start

# Start Frontend  
cd frontend && npm run dev

# Access Platform
http://localhost:5173
```

## 📍 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `/` | Homepage with featured items |
| **Listings** | `/listings` | All property listings |
| **Projects** | `/projects` | Building developments |
| **Property Details** | `/property/:id` | Individual property page |
| **Project Details** | `/project/:id` | Individual project page |
| **Contact** | `/contact` | Contact form |
| **Admin** | `/admin` | Admin dashboard |
| **Login** | `/login` | Admin login |

## 🎨 Design Tokens

```css
/* Colors */
--primary: #2c2863      /* Dark Blue */
--accent: #e81d2b       /* Red */
--bg-light: #f8fafc     /* Slate 50 */
--bg-white: #ffffff     /* White */
--text-dark: #1f2b52    /* Headings */
--text-body: #374151    /* Body text */

/* Spacing */
--spacing-sm: 1.5rem    /* 24px */
--spacing-md: 2rem      /* 32px */
--spacing-lg: 3rem      /* 48px */
--spacing-xl: 4rem      /* 64px */

/* Borders */
--radius-sm: 0.75rem    /* 12px */
--radius-md: 1rem       /* 16px */
--radius-lg: 1.5rem     /* 24px */
--radius-xl: 2rem       /* 32px */
```

## 📊 Data Models

### Property (30+ fields)
```javascript
{
  // Basic
  title, type, price, status, description,
  
  // Details
  bedrooms, bathrooms, area, lotSize, 
  yearBuilt, parking, floors,
  
  // Location
  location, address, neighborhood, zipCode,
  
  // Media
  image, images[], floorPlans[], 
  virtualTour, videoUrl,
  
  // Features
  features[], amenities[],
  
  // Agent
  agentName, agentEmail, agentPhone, agentPhoto,
  
  // System
  featured, views, createdAt, updatedAt
}
```

### Project (15+ fields)
```javascript
{
  name, status, location, description,
  coverImage, images[], units, size,
  amenities[], features[], timeline,
  completionDate, featured,
  relatedProperties[], createdAt
}
```

## 🎯 Status Values

### Property Status
- `For Sale` - Green badge
- `For Rent` - Blue badge
- `Sold` - Gray badge
- `Pending` - Orange badge

### Project Status
- `Completed` - Green badge
- `In Progress` - Blue badge
- `Upcoming` - Orange badge

## 🔑 Admin Actions

### Properties Tab
```
Add Property → Fill form → Upload images → Submit
Edit Property → Click Edit → Modify → Update
Delete Property → Click Delete → Confirm
```

### Projects Tab
```
Add Project → Fill form → Upload images → Submit
Edit Project → Click Edit → Modify → Update
Delete Project → Click Delete → Confirm
```

## 📝 Form Fields Quick Reference

### Property Form (Required *)
```
Basic:
- Title *
- Type * (Villa/Apartment/House/Studio/Penthouse)
- Price *
- Status (For Sale/For Rent/Sold/Pending)
- Description *
- Location *

Details:
- Bedrooms, Bathrooms, Area
- Lot Size, Year Built, Parking, Floors

Location:
- Address, Neighborhood, Zip Code

Features:
- Features (comma-separated)
- Amenities (comma-separated)

Images:
- Main Image * (1 file)
- Gallery Images (up to 10)
- Floor Plans (up to 5)

Media:
- Virtual Tour URL
- Video URL

Agent:
- Name, Email, Phone
- Photo (1 file)

System:
- Featured checkbox
```

### Project Form (Required *)
```
Basic:
- Name *
- Status * (Completed/In Progress/Upcoming)
- Location *
- Description *

Details:
- Units, Size, Timeline, Completion Date

Features:
- Amenities (comma-separated)
- Features (comma-separated)

Images:
- Cover Image * (1 file)
- Gallery Images (up to 10)

System:
- Featured checkbox
```

## 🎨 Component Usage

### PropertyCard
```jsx
<PropertyCard property={propertyObject} />
```

### ProjectCard
```jsx
<ProjectCard project={projectObject} />
```

## 🔌 API Endpoints

### Properties
```
GET    /api/properties          - Get all
GET    /api/properties/featured - Get featured
POST   /api/properties          - Create (admin)
PUT    /api/properties/:id      - Update (admin)
DELETE /api/properties/:id      - Delete (admin)
```

### Projects
```
GET    /api/projects            - Get all
GET    /api/projects/featured   - Get featured
GET    /api/projects/status/:s  - Get by status
GET    /api/projects/:id        - Get one
POST   /api/projects            - Create (admin)
PUT    /api/projects/:id        - Update (admin)
DELETE /api/projects/:id        - Delete (admin)
```

## 🖼️ Image Upload

### Supported Formats
- JPG, JPEG, PNG, WebP
- Max size: 10MB per file
- Cloudinary hosting

### Upload Fields
```javascript
// Property
image: single file (main)
images: multiple files (gallery)
floorPlans: multiple files
agentPhoto: single file

// Project
coverImage: single file (main)
images: multiple files (gallery)
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 768px: Single column, stacked

/* Tablet */
768px - 1279px: 2 columns, adjusted

/* Desktop */
≥ 1280px: 3 columns, full layout
```

## 🎯 Key Features Checklist

### Property Details Page
- [x] Hero section with gradient
- [x] Image gallery + lightbox
- [x] Property details grid
- [x] Features & amenities
- [x] Floor plans section
- [x] Virtual tour embed
- [x] Location + map placeholder
- [x] Agent contact card
- [x] Contact form
- [x] Similar properties
- [x] Share/favorite buttons

### Projects Page
- [x] Status filtering
- [x] Project cards
- [x] Featured projects
- [x] Image galleries
- [x] Related properties
- [x] Admin management

## 🐛 Common Issues

### Images not showing?
```bash
# Check Cloudinary config
backend/.env:
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Database connection failed?
```bash
# Check MongoDB config
backend/.env:
MONGODB_URI=your_connection_string
```

### Port already in use?
```bash
# Change port
backend/.env:
PORT=5001

frontend/vite.config.js:
server: { port: 5174 }
```

## 📚 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - This overview
2. **PROJECTS_FEATURE_IMPLEMENTATION.md** - Projects docs
3. **PROJECTS_QUICK_START.md** - Projects guide
4. **PROJECTS_VISUAL_GUIDE.md** - Projects UI
5. **PROPERTY_DETAILS_UPGRADE.md** - Property docs
6. **BEFORE_AFTER_COMPARISON.md** - Comparison
7. **QUICK_REFERENCE.md** - This file

## 🎓 Tips & Tricks

### Best Image Sizes
- Main images: 1920x1080px
- Thumbnails: Auto-generated
- Agent photos: 400x400px
- Floor plans: 1200x800px

### Content Guidelines
- Descriptions: 150-300 words
- Features: 5-10 items
- Amenities: 5-10 items
- Images: 5-10 per property

### Performance
- Optimize images before upload
- Use WebP format when possible
- Limit gallery to 10 images
- Enable lazy loading

## 🔐 Security Notes

- Admin routes protected
- File upload validation
- Input sanitization
- CORS configured
- JWT authentication

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Check for errors
npm run lint
```

## ✅ Pre-Launch Checklist

- [ ] Environment variables set
- [ ] Database connected
- [ ] Cloudinary configured
- [ ] Admin account created
- [ ] Sample data added
- [ ] Images uploaded
- [ ] Mobile tested
- [ ] Cross-browser tested
- [ ] Forms validated
- [ ] Links working

## 🎉 Success!

Your platform is ready with:
- ✅ Projects feature
- ✅ Premium property details
- ✅ Enhanced admin dashboard
- ✅ Responsive design
- ✅ Production-ready code

**Happy building!** 🚀
