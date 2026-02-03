import { siteConfig } from "@/config/site";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import ProjectCard from "@/components/ProjectCard";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Metadata for the homepage
 */
export const metadata = {
  title: `${siteConfig.name} - ${siteConfig.title}`,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
};

/**
 * Server-side data fetching for projects and blog posts
 */
async function getFeaturedProjects() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/projects?featured=true&limit=3`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data.projects : [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

async function getLatestPosts() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/blog?limit=3`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data.posts : [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();
  const latestPosts = await getLatestPosts();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Hero />

        <TechStack />

        {/* Featured Projects Section */}
        <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-900/50">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Featured Work</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  A selection of my most challenging and impactful software engineering projects.
                </p>
              </div>
              <Link
                href="/projects"
                className="group flex items-center gap-2 text-sm font-bold bg-white dark:bg-gray-800 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                Browse All
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: any) => (
                <ProjectCard key={project._id} project={project} />
              ))}
              {featuredProjects.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <p className="text-gray-500">No projects found. Seed the database to see content.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Technical Writing</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Deep dives into software architecture, devops, and modern web development.
                </p>
              </div>
              <Link
                href="/blog"
                className="group flex items-center gap-2 text-sm font-bold bg-white dark:bg-gray-800 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                Explore Blog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post: any) => (
                <BlogCard key={post._id} post={post} />
              ))}
              {latestPosts.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                  <p className="text-gray-500">No posts found. Seed the database to see content.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Have a project in mind?
            </h2>
            <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
              I'm always open to discussing new opportunities, code challenges, or just talking shop about software engineering.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Start a Conversation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
