import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { markdownToHtml } from "@/lib/markdown";
import { Calendar, Tag, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function getPost(slug: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseUrl}/api/blog/${slug}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) return { title: "Post Not Found" };

    return {
        title: `${post.title} | ${siteConfig.name} Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage || siteConfig.seo.ogImage],
            type: "article",
            publishedTime: post.publishedAt,
            tags: post.tags,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const contentHtml = await markdownToHtml(post.contentMarkdown);
    const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    // Calculate read time roughly
    const wordsPerMinute = 200;
    const textLength = post.contentMarkdown.split(/\s+/).length;
    const readTime = Math.ceil(textLength / wordsPerMinute);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <article className="container max-w-4xl mx-auto px-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-12"
                    >
                        <ChevronLeft size={16} />
                        Back to Blog
                    </Link>

                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {formattedDate}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {readTime} min read
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-12">
                            {post.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/blog?tag=${tag}`}
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>

                        {post.coverImage && (
                            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </header>

                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-3xl prose-pre:bg-gray-900 prose-pre:rounded-2xl prose-code:text-blue-500 dark:prose-code:text-blue-400"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}
