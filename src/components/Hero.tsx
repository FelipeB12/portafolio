"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Hero() {

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
            {/* Background blobs for premium look */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="container max-w-5xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        Available for new opportunities
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Hi, I'm <span className="text-blue-600">{siteConfig.name}</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-tight">
                        {siteConfig.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
                        {siteConfig.proposition}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <Link
                        href="#projects"
                        className="group px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-xl font-semibold transition-all hover:translate-y-[-2px] hover:shadow-xl flex items-center gap-2"
                    >
                        View Projects
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <button
                        onClick={() => window.open("/api/cv/download", "_blank")}
                        className="px-8 py-4 bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:translate-y-[-2px] flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        Explore CV
                    </button>

                    <Link
                        href="/contact"
                        className="px-8 py-4 text-gray-600 dark:text-gray-400 font-semibold transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Me
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                    />
                </div>
            </motion.div>
        </section>
    );
}
