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
 * Server-side data fetching
 */
async function getFeaturedProjects() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/projects?featured=true&limit=3`, {
      next: { revalidate: 60 },
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
      next: { revalidate: 60 },
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
  const [featuredProjects, latestPosts] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow font-sans">
        <Hero />

        <TechStack />

        {/* Featured Projects Section */}
        <section id="projects" className="py-24 bg-background dark:bg-slate-950/50">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-6xl font-black mb-4 tracking-tighter uppercase font-display">
                  <span className="text-brand-red">Featured</span> Work
                </h2>
                <p className="text-muted-text text-lg">
                  Disciplined engineering applied to complex problems.
                </p>
              </div>
              <Link
                href="/projects"
                className="btn-secondary group flex items-center gap-3 px-8"
              >
                Browse All
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: any) => (
                <ProjectCard key={project._id} project={project} />
              ))}
              {featuredProjects.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                  <p className="text-muted-text">No projects found yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        <section id="blog" className="py-24 bg-white dark:bg-slate-900 border-t border-border">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-6xl font-black mb-4 tracking-tighter uppercase font-display">
                  Technical <span className="text-brand-gold">Writing</span>
                </h2>
                <p className="text-muted-text text-lg">
                  Logically structured deep dives into modern technology.
                </p>
              </div>
              <Link
                href="/blog"
                className="btn-secondary group flex items-center gap-3 px-8"
              >
                Explore Blog
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post: any) => (
                <BlogCard key={post._id} post={post} />
              ))}
              {latestPosts.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                  <p className="text-muted-text">No posts available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-red">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase font-display">
              Built for <span className="text-brand-gold italic">Impact</span>.
            </h2>
            <p className="text-red-50 text-xl mb-12 max-w-2xl mx-auto font-medium">
              Ready to apply professional discipline and analytical logic to your next big challenge.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-6 bg-white text-brand-red rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-brand-gold/20"
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
