import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Blog | ${siteConfig.name}`,
    description: "Writing about software engineering, devops, and modern web development.",
};

async function getPosts(tag?: string, page = 1) {
    const limit = 9;
    const skip = (page - 1) * limit;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const url = new URL(`${baseUrl}/api/blog`);
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("skip", skip.toString());
    if (tag) url.searchParams.set("tag", tag);

    try {
        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) return { posts: [], total: 0 };
        const json = await res.json();
        return json.success ? json.data : { posts: [], total: 0 };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { posts: [], total: 0 };
    }
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string; page?: string }>;
}) {
    const params = await searchParams;
    const tag = params.tag;
    const page = parseInt(params.page || "1");

    const { posts, total } = await getPosts(tag, page);
    const totalPages = Math.ceil(total / 9);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <header className="mb-24 text-center max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display uppercase leading-[1.1]">
                            Technical <span className="text-brand-gold">Writing</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-text max-w-3xl mx-auto font-medium mt-8 leading-relaxed">
                            Deep dives into the technologies I use every day. Logically structured insights for the <span className="text-gray-900 dark:text-white font-bold">modern engineer.</span>
                        </p>
                    </header>

                    {/* Tag Filter (Placeholder/Simple list) */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        <Link
                            href="/blog"
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                !tag
                                    ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
                                    : "bg-card border-border text-muted-text hover:border-brand-red/50"
                            )}
                        >
                            All Posts
                        </Link>
                        {/* Ideally fetch unique tags from API, but for now simple list */}
                        {["Next.js", "TypeScript", "React", "MongoDB", "Architecture"].map((t) => (
                            <Link
                                key={t}
                                href={`/blog?tag=${t}`}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    tag === t
                                        ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
                                        : "bg-card border-border text-muted-text hover:border-brand-red/50"
                                )}
                            >
                                {t}
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {posts.map((post: any) => (
                            <BlogCard key={post._id} post={post} />
                        ))}
                        {posts.length === 0 && (
                            <div className="col-span-full py-32 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-gray-500 text-lg font-medium">No blog posts found under this criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <Link
                                    key={i}
                                    href={`/blog?page=${i + 1}${tag ? `&tag=${tag}` : ""}`}
                                    className={cn(
                                        "w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all border",
                                        page === i + 1
                                            ? "bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600"
                                    )}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

import { cn } from "@/lib/utils";
import Link from "next/link";
