"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const skills = [
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "N8N", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/n8n/n8n-original.svg" },
    { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
];

export default function TechStack() {
    return (
        <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase font-display">
                        Technical <span className="text-brand-red">Arsenal</span>
                    </h2>
                    <p className="text-muted-text max-w-2xl mx-auto font-medium">
                        Standardized tools for high-performance, logical engineering.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="flex flex-col items-center group"
                        >
                            <div className="relative w-16 h-16 mb-4 p-3 bg-card rounded-2xl flex items-center justify-center grayscale group-hover:grayscale-0 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/50 border border-border transition-all duration-300">
                                <img
                                    src={skill.icon}
                                    alt={skill.name}
                                    className="w-10 h-10 object-contain z-10"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-text group-hover:text-brand-red transition-colors">
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
