"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessages: Record<string, { title: string; message: string }> = {
        Configuration: {
            title: "Configuration Error",
            message: "There is a problem with the server configuration. This usually happens when environment variables (like NEXTAUTH_SECRET or GITHUB_ID) are missing or incorrect.",
        },
        AccessDenied: {
            title: "Access Denied",
            message: "You do not have permission to sign in. If you believe this is an error, please contact the administrator.",
        },
        Verification: {
            title: "Link Expired",
            message: "The sign-in link has expired or has already been used. Please try signing in again.",
        },
        Default: {
            title: "Authentication Error",
            message: "An unexpected error occurred during the authentication process. Please try again later.",
        },
    };

    const { title, message } = errorMessages[error as string] || errorMessages.Default;

    return (
        <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-red-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-brand-red" size={48} />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-black font-display uppercase tracking-tight">{title}</h1>
                <p className="text-muted-text leading-relaxed max-w-sm mx-auto">
                    {message}
                </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
                <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-red text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-brand-red-hover transition-all shadow-xl shadow-brand-red/20"
                >
                    <RefreshCw size={20} />
                    Try Again
                </Link>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </div>

            {error && (
                <p className="text-[10px] text-gray-400 font-mono pt-4">
                    Error Code: {error}
                </p>
            )}
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center px-4 py-32 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-md w-full text-center">
                    <Suspense fallback={
                        <div className="flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                        </div>
                    }>
                        <ErrorContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
