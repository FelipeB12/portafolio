# Full-Stack Portfolio with Admin Dashboard

A production-ready portfolio website built with Next.js, TypeScript, MongoDB, and NextAuth. Features a complete Admin Dashboard for managing projects, blog posts, CV, and contact messages without touching code.

## 🚀 Tech Stack

- **Frontend & Backend**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Mongoose (to be implemented)
- **Authentication**: NextAuth.js with email + GitHub OAuth (to be implemented)
- **File Storage**: Cloudinary for images and CV PDFs (to be implemented)
- **Markdown**: remark + rehype for blog content (to be implemented)
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **CI/CD**: GitHub Actions → Vercel

## 📋 Prerequisites

- Node.js 20+ and npm
- MongoDB instance (local or Atlas)
- Cloudinary account (for file uploads)
- GitHub OAuth app (for authentication)

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
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
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

## 🔐 Authentication

The Admin Dashboard requires authentication. Only users with `role: "admin"` can access CRUD operations.

**Creating the first admin user:**
```bash
npm run create-admin  # (to be implemented)
```

Or manually add to MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:
- Create preview deployments for PRs
- Deploy to production on merge to `main`
- Run build checks via GitHub Actions

### Environment Variables in Vercel

Add all variables from `.env.example` in your Vercel project settings.

## 📚 API Documentation

API documentation will be available at `/docs/API.md` (to be implemented).

## 🎯 Development Roadmap

- [x] **Phase 1**: Project scaffold and tooling
- [ ] **Phase 2**: Database models and MongoDB integration
- [ ] **Phase 3**: NextAuth authentication
- [ ] **Phase 4**: API routes (CRUD operations)
- [ ] **Phase 5**: Public pages (Hero, Projects, Blog, Contact)
- [ ] **Phase 6**: Admin Dashboard
- [ ] **Phase 7**: Integrations (Cloudinary, email, webhooks)

## 📝 License

MIT

## 👤 Author

Felipe B - Full-Stack Developer

---

**Status**: 🚧 Phase 1 Complete - Project scaffold ready for development
