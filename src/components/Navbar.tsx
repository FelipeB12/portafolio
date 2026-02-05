"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, Github, LayoutDashboard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Projects", href: "/projects" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-800 py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    {siteConfig.name}
                    <span className="text-blue-600">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="GitHub"
                    >
                        <Github size={18} />
                    </a>

                    {status === "authenticated" ? (
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-100 dark:border-gray-800">
                            {session.user.role === "admin" && (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <LayoutDashboard size={14} /> Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors ml-4"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div
                className={cn(
                    "fixed inset-0 top-[60px] bg-white dark:bg-gray-900 z-40 md:hidden transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col items-center gap-8 pt-20">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {status === "authenticated" && session.user.role === "admin" && (
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-bold text-blue-600"
                        >
                            Dashboard
                        </Link>
                    )}

                    <div className="flex flex-col items-center gap-4 mt-6">
                        {status === "authenticated" ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-8 py-3 bg-red-50 text-red-500 rounded-2xl font-bold"
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        ) : (
                            <Link
                                href="/auth/signin"
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold"
                            >
                                Sign In to Admin
                            </Link>
                        )}

                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mt-4"
                        >
                            <Github size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
