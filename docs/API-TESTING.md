# Backend Testing Guide

This document provides curl commands and testing instructions for all API endpoints.

## Prerequisites

1. Start MongoDB (local or Atlas connection)
2. Copy `.env.example` to `.env.local` and configure
3. Run seed script: `npm run seed`
4. Start dev server: `npm run dev`

## Authentication

### Sign In (Email Provider)
```bash
# NextAuth will send a magic link to the email
# Visit: http://localhost:3000/api/auth/signin
```

### Sign In (GitHub OAuth)
```bash
# Visit: http://localhost:3000/api/auth/signin
# Click "Sign in with GitHub"
```

## Public Endpoints

### Get All Projects
```bash
curl http://localhost:3000/api/projects
```

### Get Featured Projects Only
```bash
curl "http://localhost:3000/api/projects?featured=true"
```

### Get Project by Slug
```bash
curl http://localhost:3000/api/projects/e-commerce-platform
```

### Get All Blog Posts
```bash
curl http://localhost:3000/api/blog
```

### Get Blog Post by Slug
```bash
curl http://localhost:3000/api/blog/building-scalable-nextjs-applications
```

### Get CV
```bash
curl http://localhost:3000/api/cv
```

### Submit Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to discuss a project",
    "projectBudget": "$5000-$10000"
  }'
```

### Test Rate Limiting (run multiple times quickly)
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test"}' &
done
```

## Admin Endpoints (Require Authentication)

**Note**: You need to be authenticated as an admin user. Use Postman or similar tool to handle session cookies.

### Create Project
```bash
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "shortDescription": "A new project",
    "problem": "Problem statement",
    "solution": "Solution description",
    "role": "Full-Stack Developer",
    "techStack": ["Next.js", "TypeScript"],
    "keyDecisions": ["Decision 1"],
    "screenshots": [],
    "featured": false
  }'
```

### Update Project
```bash
curl -X PUT http://localhost:3000/api/admin/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "featured": true
  }'
```

### Delete Project
```bash
curl -X DELETE http://localhost:3000/api/admin/projects/PROJECT_ID \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Create Blog Post
```bash
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "excerpt": "This is a new blog post",
    "contentMarkdown": "# Hello World\n\nThis is content.",
    "tags": ["test"],
    "publishedAt": "2024-03-15T00:00:00.000Z"
  }'
```

### Get All Contact Messages
```bash
curl http://localhost:3000/api/admin/contact \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Mark Contact as Processed
```bash
curl -X PATCH http://localhost:3000/api/admin/contact/MESSAGE_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"processed": true}'
```

### Upload CV
```bash
curl -X POST http://localhost:3000/api/admin/cv \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "fileUrl": "https://example.com/cv.pdf",
    "fileName": "my-cv.pdf"
  }'
```

## Webhook Endpoint

### Test n8n Webhook
```bash
curl -X POST http://localhost:3000/api/webhooks/n8n \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_WEBHOOK_SECRET" \
  -d '{
    "type": "contact_form",
    "data": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```

## Testing with Postman

1. Import the following collection or create requests manually
2. Set up environment variables for `baseUrl` and `sessionToken`
3. Use Postman's cookie management for authenticated requests

## Expected Responses

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation error details"
}
```

## Common Issues

1. **401 Unauthorized**: Not signed in or session expired
2. **403 Forbidden**: Signed in but not admin
3. **429 Too Many Requests**: Rate limit exceeded
4. **409 Conflict**: Slug already exists
5. **404 Not Found**: Resource doesn't exist
