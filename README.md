# Full-Stack Portfolio with Admin Dashboard

A production-ready portfolio website built with Next.js, TypeScript, MongoDB, and NextAuth. Features a complete Admin Dashboard for managing projects, blog posts, CV, and contact messages without touching code.

## 🚀 Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose 
- **Authentication**: NextAuth.js with email + GitHub OAuth 
- **File Storage**: Cloudinary for images and CV PDFs 
- **Markdown**: remark + rehype for blog content 
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **CI/CD**: GitHub Actions → Vercel

## 📋 Prerequisites

- Node.js 20+ and npm
- MongoDB instance
- Cloudinary account
- GitHub OAuth app

## 🛠️ Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portafolio
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Generate with: `any long string`
- `NEXTAUTH_URL` - `http://localhost:3000` for local dev
- `CLOUDINARY_*` - Your Cloudinary credentials
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth app credentials
- Email provider credentials (Resend or SMTP)
- `N8N_WEBHOOK_URL` - Your n8n webhook endpoint (optional)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Open Vitest UI
- `npm run type-check` - Run TypeScript type checking
- `npm run seed` - Seed database with sample data (to be implemented)

## 🏗️ Project Structure

```
portafolio/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Homepage
│   │   ├── admin/        # Admin dashboard (protected)
│   │   ├── projects/     # Projects showcase
│   │   ├── blog/         # Blog posts
│   │   └── api/          # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── models/           # MongoDB models (Mongoose)
│   ├── schemas/          # Validation schemas (Zod)
│   ├── scripts/          # Database seeds and utilities
│   └── tests/            # Test files
├── public/               # Static assets
└── .github/workflows/    # CI/CD workflows
```

## 🔐 Authentication & Administration

The Admin Dashboard is protected by NextAuth with role-based access.

### 1. Create your Admin Account
1.  Navigate to `/auth/signin` and log in with your GitHub or Email.
2.  Your account will be created as a `viewer` by default.
3.  Promote yourself to Admin using the CLI:
    ```bash
    # Use the email you used to log in
    npm run promote-admin <email>
    
    # OR use your ID if your email is private/null
    npm run promote-admin <id>
    ```

### 2. Manage Content
Once promoted, navigate to `/dashboard` to manage:
- **Projects**: CRUD case studies with Cloudinary images.
- **Blog**: Write technical posts using Markdown.
- **CV**: Upload PDFs that update globally.
- **Contact**: View and manage inquiries.

## 🧪 Testing

```bash
npm run test        # Unit tests
npm run type-check  # Type safety
```

## 🚢 Deployment

1.  **Environment Variables**: Ensure all variables from `.env.example` are set in your provider (e.g., Vercel).
2.  **Database**: Ensure your MongoDB IP whitelist allows the deployment server.
3.  **Authentication**: Update your GitHub OAuth callback URL to provide the production domain.

## 👤 Author

Juan Beltran - Full-Stack Developer

---

**Status**: ✅ Complete - Production-ready portfolio with unified Admin Dashboard.
