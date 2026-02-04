"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Upload, X, ChevronRight, Eye, Edit3, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import slugify from "slugify";
import { toast } from "react-hot-toast";


interface BlogEditorProps {
    initialData?: any;
    onSave: (data: any) => Promise<void>;
    isSubmitting: boolean;
}

export default function BlogEditor({ initialData, onSave, isSubmitting }: BlogEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [content, setContent] = useState(initialData?.contentMarkdown || "");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
    const [currentTag, setCurrentTag] = useState("");
    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!initialData) { // Only auto-slug for new posts
            setSlug(slugify(newTitle, { lower: true, strict: true }));
        }
    };

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setCoverImage(data.data.url);
                toast.success("Cover image uploaded!");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            slug,
            excerpt,
            contentMarkdown: content,
            tags,
            coverImage,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{initialData ? "Edit Post" : "Create New Post"}</h2>
                <div className="flex gap-4">
                    <div className="flex rounded-lg border dark:border-gray-800 p-1 bg-gray-50 dark:bg-gray-900">
                        <button
                            type="button"
                            onClick={() => setMode("edit")}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                mode === "edit" ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600" : "text-gray-500"
                            )}
                        >
                            <Edit3 size={16} /> Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("preview")}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                mode === "preview" ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600" : "text-gray-500"
                            )}
                        >
                            <Eye size={16} /> Preview
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Post"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {mode === "edit" ? (
                        <>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Post Title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                    required
                                />
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span className="font-mono">slug:</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="flex-grow bg-transparent border-none outline-none text-blue-500 font-mono"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <textarea
                                    placeholder="The content starts here... (Markdown supported)"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full min-h-[500px] bg-transparent border-none outline-none resize-none text-lg text-gray-700 dark:text-gray-300 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none min-h-[600px] p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <h1 className="mb-8">{title}</h1>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                                {content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Cover Image</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden"
                        >
                            {coverImage ? (
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <ImageIcon className="text-gray-300 mb-2" size={32} />
                                    <span className="text-xs text-gray-400">Click to upload image</span>
                                </>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Excerpt</label>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm min-h-[100px] resize-none"
                            placeholder="Short summary of the post..."
                            required
                        />
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                className="flex-grow p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                placeholder="Add tag..."
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-3 bg-blue-600 text-white rounded-lg"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium flex items-center gap-1">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
