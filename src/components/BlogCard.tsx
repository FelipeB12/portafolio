import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: {
        _id: string;
        title: string;
        slug: string;
        excerpt: string;
        publishedAt: string;
        tags: string[];
        coverImage?: string;
    };
    className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
    const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const coverImage = post.coverImage || "https://placehold.co/800x400/png?text=Blog+Post";

    return (
        <div
            className={cn(
                "group flex flex-col bg-card rounded-[2.5rem] border border-border overflow-hidden transition-all hover:border-brand-gold/50 hover:shadow-xl h-full",
                className
            )}
        >
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] uppercase tracking-widest font-black px-2 py-1 bg-brand-red text-white rounded-lg shadow-lg shadow-brand-red/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-text mb-3 uppercase tracking-widest font-bold">
                    <Calendar size={12} className="text-brand-gold" />
                    {formattedDate}
                </div>

                <h3 className="text-xl font-black mb-3 font-display group-hover:text-brand-red transition-colors leading-tight">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h3>

                <p className="text-muted-text text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                </p>

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-red hover:text-brand-red-hover group/link"
                >
                    Read Article
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
