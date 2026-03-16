---
name: Portafolio Context
description: Context, architecture, and technology stack for the Portafolio project
---

# **Portafolio - Project Context & Knowledge Base**

This document serves as the primary source of truth for the Portafolio project. It is designed to facilitate quick onboarding, knowledge transfer, and comprehensive understanding of the project's state, architecture, and operational guidelines.

---

## **1. Product & Vision**

### **1.1 Overview**
**Portafolio** is a production-ready, full-stack portfolio website built to showcase projects, blog posts, CV, and contact messages. It features a complete Admin Dashboard that allows the portfolio owner to manage all content dynamically without touching the codebase.

### **1.2 Key Features**
- **Dynamic Projects Showcase**: CRUD operations for case studies with Cloudinary image hosting.
- **Developer Blog**: Write and publish technical blog posts using Markdown (parsed with remark/rehype).
- **CV Management**: Upload PDF resumes that update globally throughout the site.
- **Contact Management**: View and manage incoming inquiries.
- **Admin Dashboard**: Role-based access protected by NextAuth, ensuring only authorized users can modify the portfolio content.

---

## **2. Architecture & Tech Stack**

### **2.1 Core Technologies**
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Animations**: Framer Motion

### **2.2 Backend & Data Storage**
- **Database**: MongoDB (via Mongoose for ODM)
- **File Storage**: Cloudinary (handles images and CV PDFs)
- **Authentication**: NextAuth.js v5 Beta (`@auth/mongodb-adapter`) utilizing Email and GitHub OAuth

### **2.3 Content Processing**
- **Markdown**: `react-markdown`, supplemented by `remark` and `rehype` ecosystem (`remark-gfm`, `rehype-highlight`, `rehype-raw`, `rehype-slug`, `rehype-autolink-headings`) for rich technical blog posts.

### **2.4 Testing & Code Quality**
- **Testing**: Vitest, React Testing Library
- **Linting & Formatting**: ESLint, Prettier

### **2.5 CI/CD & Deployment**
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

---

## **3. Project Structure**

```text
portafolio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Homepage
│   │   ├── admin/        # Admin dashboard (protected routes)
│   │   ├── projects/     # Projects showcase
│   │   ├── blog/         # Blog posts
│   │   └── api/          # API routes
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities and helper functions
│   ├── models/           # MongoDB Mongoose models
│   ├── schemas/          # Zod validation schemas
│   ├── scripts/          # Database seeds and CLI utilities
│   ├── tests/            # Vitest test files
│   └── proxy.ts          # Edge authentication and routing (Next.js 16 convention)
├── public/               # Static assets
└── .github/workflows/    # CI/CD GitHub Actions workflows
```

---

## **4. Development Guidelines**

### **4.1 Getting Started**
1. **Clone & Install**: Run `npm install` in the root directory.
2. **Environment Variables**: Copy `.env.example` to `.env.local`. Required variables include:
   - `MONGODB_URI`: MongoDB connection string.
   - `AUTH_SECRET`: Secret for signing tokens (required for NextAuth v5).
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`: NextAuth configuration and base URL.
   - `CLOUDINARY_*`: Cloudinary credentials.
   - `GITHUB_ID`, `GITHUB_SECRET`: GitHub OAuth app credentials.
3. **Run**: `npm run dev` to start the local development server on `http://localhost:3000`.

### **4.2 Key Scripts**
- `npm run dev`: Start development server.
- `npm run build`: Build the project for production.
- `npm run test`: Run Vitest test suite.
- `npm run type-check`: Execute TypeScript type checking without emitting files.
- `npm run promote-admin <email|id>`: A CLI utility script to promote a user to the Admin role, granting access to the dashboard.

### **4.3 Authentication & Administration**
- **Role-based Access**: Users log in via GitHub or Email and are assigned a `viewer` role by default.
- **Admin Promotion**: To manage content, the portfolio owner must log in, then use the `npm run promote-admin` script to elevate their privileges to admin status.

---

## **5. Deployment Strategy**
- **Environment**: Ensure all `.env.local` variables are replicated in the Vercel project settings.
- **Database Access**: Whitelist Vercel IPs (or use `0.0.0.0/0` with secure credentials) in MongoDB Atlas to allow the production server access.
- **OAuth Callbacks**: The GitHub OAuth app config must be updated to include the production domain callback URLs upon deployment launch.
