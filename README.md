# Climate Craft — Motion Furniture

Two-application architecture with shared core.

## Structure

```
project-root/
├── client-website/        # Customer-facing site (7 pages)
├── admin-dashboard/       # Admin SPA (single page, JS-driven)
├── shared/                # Shared code consumed by both apps
│   ├── css/main.css       # All shared styles + animations
│   ├── js/main.js         # All shared JS (cursor, scroll, carousel, nav, frame-seq)
│   ├── api/client.js      # Shared API client (REST endpoints)
│   ├── config/index.js    # Theme config, breakpoints, media paths
│   └── media/             # Shared media assets
│       ├── logo.png
│       └── uploads/       # Images, videos, 3D models, frame sequences
├── packages/              # Documentation / re-export bundles
│   ├── design-system/
│   ├── animations/
│   └── ui/
└── README.md
```

## Architecture Decisions

### Separation of Concerns
- **client-website/** — No admin routes, no auth UI, no management UI
- **admin-dashboard/** — No customer-facing pages, no public routes
- **shared/** — Single source of truth for all reusable code

### No Duplication
- Design tokens exist once in `shared/css/main.css`
- Animation keyframes exist once in `shared/css/main.css`
- Animation engine exists once in `shared/js/main.js`
- Media assets live in one place: `shared/media/uploads/`
- Both apps reference the same shared code via relative imports

### Routing
- Client: Multi-page HTML (linked via `<a href>`)
- Admin: Single-page app (JS-driven view switching in `admin.js`)
- Completely independent — neither depends on the other

### Authentication
- Only admin-dashboard requires auth (stub ready in `shared/api/client.js`)
- Client website never exposes admin functionality

### Responsiveness
- All existing breakpoints preserved (Desktop, Laptop, Tablet, Mobile)
- No CSS or layout changes — only file reorganization

## Running

Open any page directly in the browser:

- `client-website/index.html` — Home
- `client-website/collection.html` — Products
- `client-website/features.html` — Feature Explorer
- `client-website/product.html` — Product Detail (requires model-viewer CDN)
- `client-website/projects.html` — Case Studies
- `client-website/about.html` — About Us
- `client-website/contact.html` — Contact & Quote
- `admin-dashboard/index.html` — Admin Dashboard
