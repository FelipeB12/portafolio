"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Upload, CheckCircle, AlertCircle, Loader2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        if (file) {
            formData.append("attachment", file);
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to send message. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <header className="mb-24 text-center max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display uppercase leading-[1.1]">
                            Let's <span className="text-brand-red">talk.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-text max-w-3xl mx-auto font-medium mt-8 leading-relaxed">
                            Have a project in mind or just want to say hi? I'm always open to <span className="text-gray-900 dark:text-white font-bold">new opportunities</span> and interesting collaborations.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left Column: Info */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                {/* Header removed from here to top level */}
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-brand-red group-hover:text-white border border-brand-red/20 shadow-lg shadow-brand-red/5">
                                        <Send size={24} className="text-brand-red group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-text font-black uppercase tracking-widest">Email me at</p>
                                        <p className="text-xl font-black font-display">hello@felipe.dev</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="relative">
                            {isSuccess ? (
                                <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle className="text-green-500" size={48} />
                                    </div>
                                    <h2 className="text-3xl font-bold">Message Sent!</h2>
                                    <p className="text-gray-500 text-lg">
                                        Thank you for reaching out. I'll get back to you as soon as possible.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-white dark:bg-gray-900 p-10 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8"
                                >
                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    )}

                                    {/* Honeypot - Hidden from humans */}
                                    <div className="hidden">
                                        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <input
                                                required
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full px-6 py-4 bg-card border-border rounded-2xl focus:ring-2 focus:ring-brand-red/50 transition-all outline-none border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-text ml-2">Email</label>
                                            <input
                                                required
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full px-6 py-4 bg-card border-border rounded-2xl focus:ring-2 focus:ring-brand-red/50 transition-all outline-none border"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-2">Project Budget (Optional)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold" size={18} />
                                            <select
                                                name="projectBudget"
                                                className="w-full pl-14 pr-6 py-4 bg-card border-border rounded-2xl focus:ring-2 focus:ring-brand-gold/50 transition-all outline-none appearance-none cursor-pointer border"
                                            >
                                                <option value="">Less than $1k</option>
                                                <option value="$1k - $5k">$1k - $5k</option>
                                                <option value="$5k - $10k">$5k - $10k</option>
                                                <option value="$10k+">$10k+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-2">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            rows={5}
                                            placeholder="Tell me about your project..."
                                            className="w-full px-6 py-4 bg-card border-border rounded-2xl focus:ring-2 focus:ring-brand-red/50 transition-all outline-none resize-none border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-2">Attachment (Optional)</label>
                                        <div className={cn(
                                            "relative border-2 border-dashed border-border rounded-2xl p-6 transition-all hover:border-brand-red/50 group",
                                            file ? "bg-brand-red/5 border-brand-red" : ""
                                        )}>
                                            <input
                                                type="file"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                                                    <Upload className={cn("text-muted-text group-hover:text-brand-red", file ? "text-brand-red" : "")} size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{file ? file.name : "Choose a file"}</p>
                                                    <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full py-5 bg-brand-red hover:bg-brand-red-hover text-white rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-brand-red/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
