# PostupPK.com

## Overview

PostupPK.com is a free online utility platform providing PDF tools, image converters, text processors, calculators, and various other productivity utilities. All processing happens client-side in the browser for maximum privacy and security - no files are uploaded to servers. The application is built as a single-page application (SPA) using React with TypeScript, designed to work offline-first with service worker caching.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 19.2.1 with TypeScript 5.8.2
- **Routing:** React Router DOM 7.10.1 with HashRouter for static hosting compatibility
- **Styling:** Tailwind CSS (loaded via CDN)
- **Icons:** Lucide React 0.555.0
- **Build Tool:** Vite 6.2.0

**Design Patterns:**
- **Code Splitting:** Lazy loading of route components to optimize initial bundle size
- **Error Boundaries:** Global error handling at the app root level
- **Component Composition:** Reusable components (Layout, Head, Loading, Features)
- **State Management:** Local React state (useState, useEffect) - no global state management library

**Key Architectural Decisions:**

1. **HashRouter over BrowserRouter**
   - **Problem:** Need to support static hosting without server-side routing configuration
   - **Solution:** Using HashRouter ensures all routes work on any static host
   - **Trade-off:** URLs contain hash fragments (#/path) but eliminate 404 issues on direct navigation

2. **Client-Side Processing Only**
   - **Problem:** Privacy concerns and server costs for file processing
   - **Solution:** All file operations execute in the browser using CDN-loaded libraries
   - **Benefits:** Zero data transmission, instant processing, no server infrastructure needed
   - **Libraries:** PDF-lib, PDF.js, Mammoth, XLSX, Tesseract.js loaded via CDN

3. **Offline-First with Service Worker**
   - **Problem:** Users need tools to work without internet connectivity
   - **Solution:** Service worker (sw.js) caches static assets and CDN libraries
   - **Implementation:** Cache-first strategy with fallback to network

4. **Dark Mode Support**
   - **Implementation:** CSS class-based dark mode with localStorage persistence
   - **Default:** Respects system preference via `prefers-color-scheme`

### Data Management

**No Backend Database:**
- All data (tools list, blog posts, constants) stored in TypeScript constants
- No API calls or database queries
- Content managed through static TypeScript files (constants.tsx)

**File Processing:**
- Files handled entirely in browser memory using File API and ArrayBuffer
- Object URLs created for download functionality
- Automatic cleanup of object URLs to prevent memory leaks

### Performance Optimizations

1. **Lazy Loading:** Route-based code splitting reduces initial JavaScript bundle
2. **CDN Libraries:** Third-party libraries loaded from CDN instead of bundled
3. **Image Optimization:** Uses Unsplash with auto-format and compression parameters
4. **Preconnect Hints:** DNS prefetching for CDN domains in index.html
5. **Intersection Observer:** Scroll-based reveal animations only trigger when visible

### SEO & Metadata

**Dynamic Head Management:**
- Custom Head component manages meta tags per route
- Open Graph and Twitter Card support
- Structured data (JSON-LD schema) for rich search results
- Canonical URL generation
- Breadcrumbs for navigation hierarchy

**Routing Strategy:**
- `/` - Homepage with tool search and categories
- `/tools/:category` - Category listing pages
- `/tool/:toolId` - Individual tool pages
- `/blog` and `/blog/:slug` - Blog listing and articles
- Static pages: `/about`, `/contact`, `/terms`, `/privacy`, etc.

## External Dependencies

### CDN Libraries (Loaded at Runtime)

**PDF Processing:**
- `pdf-lib@1.17.1` - PDF creation and manipulation
- `pdf.js@2.16.105` - PDF rendering and parsing (includes worker)

**Document Conversion:**
- `mammoth@1.6.0` - Word document (.docx) to HTML conversion
- `xlsx@0.18.5` - Excel spreadsheet processing
- `pptxgenjs@3.12.0` - PowerPoint manipulation
- `html2pdf.js@0.10.1` - HTML to PDF conversion

**Image & OCR:**
- `tesseract.js@5` - Optical character recognition
- `fabric.js@5.3.0` - Canvas manipulation for image editing

**Utilities:**
- `jszip@3.10.1` - ZIP file creation and extraction
- `lucide` - Icon library (loaded from unpkg)

**Styling:**
- Tailwind CSS - Utility-first CSS framework (configured inline)

### Development Dependencies

- `@vitejs/plugin-react@5.0.0` - Vite React plugin with Fast Refresh
- `@types/node@22.14.0` - TypeScript Node.js type definitions

### Environment Variables

**GEMINI_API_KEY:**
- Purpose: Integration with Google's Gemini AI (referenced in vite.config.ts)
- Usage: Exposed as `process.env.GEMINI_API_KEY` at build time
- Note: Currently referenced but not actively used in visible code

### Browser APIs Used

- **File API:** File reading and blob creation
- **Speech Recognition API:** For speech-to-text tools (webkit prefixed)
- **Service Worker API:** Offline functionality and caching
- **Intersection Observer API:** Scroll-based animations
- **Local Storage API:** Theme preference persistence
- **Canvas API:** Image manipulation via Fabric.js

### Hosting Requirements

- **Static hosting compatible** (no server-side rendering needed)
- **HTTPS recommended** for service worker functionality
- **No database required** - fully static content
- **Port 5000** configured for local development (vite.config.ts)