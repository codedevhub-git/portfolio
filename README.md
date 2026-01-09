```markdown
# Edgar Robledo - Developer Portfolio

A bilingual (English/Spanish) portfolio website showcasing custom software development projects. Built with a VS Code-inspired green and black aesthetic.

## 🌐 Live Site
**GitHub Pages:** `https://[your-username].github.io/`

## 🛠️ Tech Stack

- **HTML5** - Semantic markup, two separate pages for bilingual support
- **CSS3** - Custom properties, Flexbox, Grid, mobile-first responsive design
- **Vanilla JavaScript** - Modal functionality, smooth scroll navigation, project data management
- **GitHub Pages** - Static site hosting

## 📂 Project Structure

```
portfolio/
├── index.html              # English version
├── es/index.html           # Spanish version
├── css/style.css           # Shared styles (green/black theme)
├── js/script.js            # Shared functionality
├── assets/images/          # Profile and project screenshots
└── README.md
```

## 🎨 Design Features

- **VS Code-inspired theme** with bright green (`#00ff41`) on dark backgrounds
- **Bilingual support** via separate HTML pages with shared CSS/JS
- **Modal system** for detailed project views with multiple images and tech stacks
- **Responsive design** - static navigation on mobile, sticky on desktop
- **Mobile-first approach** - optimized for small screens first, scales up

## 📱 Responsive Behavior

- **Desktop (>768px):** Sticky navigation, larger typography, multi-column project grid
- **Mobile (<768px):** Static navigation, single column layout, compact spacing
- **Touch-optimized:** Larger buttons, easy scrolling, modal galleries

## 🚀 Key Features

### Project Showcases
8 featured projects with modal overlays containing:
- Multiple project screenshots in grid layout
- Detailed technical descriptions
- Tech stack badges
- Links to live sites or contact forms

### Language Toggle
Fixed-position button switches between English (`/`) and Spanish (`/es/`) versions. Both pages share the same CSS and JavaScript files.

### Modal System
Click any project image or "Read More" button to open full-screen modal with:
- Project overview and technical challenges
- Multiple images displayed in responsive grid
- Tech stack visualization
- Close via X button, Escape key, or click outside

### Contact Integration
Direct links to:
- WhatsApp (with pre-filled message)
- Email (with subject line)
- Phone call

## 🎯 Portfolio Projects Featured

1. **Ramos Elite Scape** - Hardscape & landscaping business site
2. **Trak30** - Privacy-focused budget tracker with OCR receipt scanning
3. **Rucker Dentistry** - Dental practice website
4. **Honey & Milk Lactation** - Lactation consulting services
5. **Gyderne** - AI-powered education platform
6. **Construcción Robledo** - Civil engineering business site
7. **Cosmic Cassy** - Childhood cancer resource management platform
8. **Neural Legacy** - 3D memory archive desktop app with Babylon.js

## 🔧 Technical Highlights

- **Zero dependencies** - No frameworks, no libraries, pure vanilla JavaScript
- **Performance optimized** - Minimal CSS, efficient DOM manipulation
- **Accessibility** - Semantic HTML, keyboard navigation support
- **SEO ready** - Proper meta tags, semantic structure
- **Fast loading** - Static files, optimized images

## 📝 Development Notes

### Color System
Uses CSS custom properties for consistent theming across both language versions.

### JavaScript Architecture
Single `projectData` object stores all project content in both languages. Modal detection automatically selects correct language based on page's `lang` attribute.

### Image Optimization
- Project thumbnails: 300x200px recommended
- Modal images: WebP format where possible for better compression
- Responsive grid adapts to available images

### Mobile Considerations
Navigation changed from sticky to static on mobile to save screen space. All typography and spacing scales down proportionally below 768px breakpoint.

## 🌐 Deployment

Hosted on GitHub Pages. Both English and Spanish versions accessible from root and `/es/` paths respectively.

---

**Built by Edgar Robledo**  
**Contact:** edgar@codedevhub.com | (803) 209-7750
```