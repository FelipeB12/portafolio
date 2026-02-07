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
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand-red/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="container max-w-5xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 text-brand-gold mb-8 border border-brand-red/20 font-semibold"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold"></span>
                    </span>
                    Available for new projects
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-8xl font-black mb-6 tracking-tight font-display"
                >
                    BRING YOUR <span className="text-brand-red">IDEAS</span> <br />
                    TO <span className="text-brand-gold italic">LIFE</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-muted-text max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    {siteConfig.proposition}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#projects"
                        className="btn-primary w-full sm:w-auto"
                    >
                        View Projects
                        <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                    </Link>

                    <button
                        onClick={() => window.open("/api/cv/download", "_blank")}
                        className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        Explore CV
                    </button>

                    <Link
                        href="/contact"
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
