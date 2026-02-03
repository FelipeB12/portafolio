#!/usr/bin/env tsx

/**
 * Database Seed Script
 * 
 * This script populates the database with sample data for development.
 * Run with: npm run seed
 */

import connectDB from "../lib/db";
import User from "../models/User";
import Project from "../models/Project";
import BlogPost from "../models/BlogPost";
import CV from "../models/CV";

async function seed() {
    try {
        console.log("🌱 Starting database seed...");

        await connectDB();
        console.log("✅ Connected to MongoDB");

        // Create admin user
        console.log("\n👤 Creating admin user...");
        const adminUser = await User.findOneAndUpdate(
            { email: "admin@portfolio.com" },
            {
                name: "Admin User",
                email: "admin@portfolio.com",
                role: "admin",
            },
            { upsert: true, new: true }
        );
        console.log(`✅ Admin user created: ${adminUser.email}`);

        // Create sample projects
        console.log("\n📁 Creating sample projects...");
        const sampleProjects = [
            {
                title: "E-Commerce Platform",
                slug: "e-commerce-platform",
                shortDescription:
                    "A full-stack e-commerce platform with real-time inventory management",
                problem:
                    "Small businesses needed an affordable, scalable solution to sell online with real-time inventory tracking across multiple channels.",
                solution:
                    "Built a modern e-commerce platform using Next.js, MongoDB, and Stripe. Implemented real-time inventory sync, automated order processing, and multi-channel integration.",
                role: "Full-Stack Developer & Technical Lead",
                techStack: [
                    "Next.js",
                    "TypeScript",
                    "MongoDB",
                    "Stripe",
                    "Tailwind CSS",
                    "Redis",
                ],
                keyDecisions: [
                    "Chose Next.js for SEO benefits and server-side rendering",
                    "Implemented Redis for real-time inventory caching",
                    "Used Stripe webhooks for reliable payment processing",
                ],
                screenshots: [
                    {
                        url: "https://placehold.co/800x600/png",
                        alt: "Homepage screenshot",
                    },
                    {
                        url: "https://placehold.co/800x600/png",
                        alt: "Product page screenshot",
                    },
                ],
                liveLink: "https://example.com",
                githubLink: "https://github.com/example/ecommerce",
                featured: true,
            },
            {
                title: "Task Management SaaS",
                slug: "task-management-saas",
                shortDescription:
                    "Collaborative task management tool with real-time updates",
                problem:
                    "Teams struggled with fragmented communication and lack of visibility into project progress.",
                solution:
                    "Developed a real-time collaborative task management platform with WebSocket integration, role-based permissions, and automated notifications.",
                role: "Lead Developer",
                techStack: [
                    "React",
                    "Node.js",
                    "PostgreSQL",
                    "Socket.io",
                    "Docker",
                    "AWS",
                ],
                keyDecisions: [
                    "Used Socket.io for real-time collaboration features",
                    "Implemented optimistic UI updates for better UX",
                    "Containerized with Docker for easy deployment",
                ],
                screenshots: [
                    {
                        url: "https://placehold.co/800x600/png",
                        alt: "Dashboard view",
                    },
                ],
                liveLink: "https://example.com/tasks",
                githubLink: "",
                featured: true,
            },
            {
                title: "AI Content Generator",
                slug: "ai-content-generator",
                shortDescription:
                    "AI-powered content generation tool for marketers",
                problem:
                    "Content creators spent hours writing blog posts, social media content, and marketing copy.",
                solution:
                    "Built an AI-powered content generation platform using OpenAI's GPT-4 API with custom prompts, templates, and content optimization features.",
                role: "Full-Stack Developer",
                techStack: [
                    "Next.js",
                    "OpenAI API",
                    "MongoDB",
                    "Tailwind CSS",
                    "Vercel",
                ],
                keyDecisions: [
                    "Implemented prompt engineering for better output quality",
                    "Added content versioning and A/B testing features",
                    "Used streaming responses for better UX",
                ],
                screenshots: [],
                liveLink: "",
                githubLink: "https://github.com/example/ai-content",
                featured: false,
            },
        ];

        for (const projectData of sampleProjects) {
            await Project.findOneAndUpdate(
                { slug: projectData.slug },
                projectData,
                { upsert: true, new: true }
            );
            console.log(`  ✅ Created project: ${projectData.title}`);
        }

        // Create sample blog posts
        console.log("\n📝 Creating sample blog posts...");
        const samplePosts = [
            {
                title: "Building Scalable Next.js Applications",
                slug: "building-scalable-nextjs-applications",
                excerpt:
                    "Learn best practices for building production-ready Next.js applications that scale.",
                contentMarkdown: `# Building Scalable Next.js Applications

Next.js has become the go-to framework for building modern React applications. Here are some best practices I've learned from building production applications.

## 1. Use App Router

The new App Router in Next.js 13+ provides better performance and developer experience.

## 2. Implement Proper Caching

Use React Server Components and Next.js caching strategies effectively.

## 3. Optimize Images

Always use the Next.js Image component for automatic optimization.

## Conclusion

Following these practices will help you build faster, more maintainable applications.`,
                tags: ["Next.js", "React", "Performance", "Best Practices"],
                coverImage: "https://placehold.co/1200x630/png",
                publishedAt: new Date("2024-01-15"),
            },
            {
                title: "MongoDB Schema Design Patterns",
                slug: "mongodb-schema-design-patterns",
                excerpt:
                    "Essential MongoDB schema design patterns for building efficient databases.",
                contentMarkdown: `# MongoDB Schema Design Patterns

Designing effective MongoDB schemas is crucial for application performance.

## Embedding vs Referencing

Choose the right pattern based on your access patterns.

## Indexing Strategies

Proper indexing can make or break your application's performance.`,
                tags: ["MongoDB", "Database", "Schema Design"],
                coverImage: "https://placehold.co/1200x630/png",
                publishedAt: new Date("2024-02-01"),
            },
            {
                title: "TypeScript Tips for React Developers",
                slug: "typescript-tips-react-developers",
                excerpt:
                    "Practical TypeScript tips to improve your React development workflow.",
                contentMarkdown: `# TypeScript Tips for React Developers

TypeScript makes React development more robust and maintainable.

## Type Your Props Properly

Use interfaces for component props.

## Leverage Generics

Generics make your components more reusable.`,
                tags: ["TypeScript", "React", "Development"],
                coverImage: "",
                publishedAt: new Date("2024-03-01"),
            },
        ];

        for (const postData of samplePosts) {
            await BlogPost.findOneAndUpdate(
                { slug: postData.slug },
                postData,
                { upsert: true, new: true }
            );
            console.log(`  ✅ Created blog post: ${postData.title}`);
        }

        // Create sample CV entry
        console.log("\n📄 Creating sample CV...");
        await CV.findOneAndUpdate(
            { fileName: "sample-cv.pdf" },
            {
                fileUrl: "https://placehold.co/sample-cv.pdf",
                fileName: "sample-cv.pdf",
                uploadedAt: new Date(),
                uploadedBy: adminUser._id,
            },
            { upsert: true, new: true }
        );
        console.log("✅ Sample CV created");

        console.log("\n✨ Seed completed successfully!");
        console.log("\n📋 Summary:");
        console.log(`  - Admin user: ${adminUser.email}`);
        console.log(`  - Projects: ${sampleProjects.length}`);
        console.log(`  - Blog posts: ${samplePosts.length}`);
        console.log(`  - CV: 1`);
        console.log("\n🔐 To sign in as admin:");
        console.log(`  Email: ${adminUser.email}`);
        console.log("  Use NextAuth email provider or GitHub OAuth");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();

export { };
