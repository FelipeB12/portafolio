"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Mail, Loader2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("email");
        try {
            await signIn("email", { email, callbackUrl: "/dashboard" });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleGithubSignIn = async () => {
        setIsLoading("github");
        try {
            await signIn("github", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">

            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-10 left-10 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Site
            </Link>

            <div className="w-full max-w-md space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex w-16 h-16 bg-blue-600 rounded-[2rem] items-center justify-center shadow-2xl shadow-blue-500/20 mb-2">
                        <Lock className="text-white" size={28} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">
                        Admin <span className="text-blue-600 text-glow">Portal</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Please sign in to access your dashboard.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-10 rounded-[3rem] shadow-sm space-y-8">

                    {/* Github Provider */}
                    <button
                        onClick={handleGithubSignIn}
                        disabled={!!isLoading}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {isLoading === "github" ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Github size={20} />
                        )}
                        Continue with GitHub
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-900 px-4 text-gray-400 font-black tracking-widest">Or login with</span>
                        </div>
                    </div>

                    {/* Email Provider */}
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!!isLoading}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isLoading === "email" ? (
                                <Loader2 className="animate-spin mx-auto" size={20} />
                            ) : (
                                "Send Login Link"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Tip */}
                <p className="text-center text-xs text-gray-400 font-medium">
                    New to the dashboard? Log in first, then promote your account via CLI.
                </p>
            </div>

            <style jsx>{`
                .text-glow {
                    text-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </div>
    );
}
