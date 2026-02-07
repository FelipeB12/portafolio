"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { CheckCircle, Flame, Zap, Target, Globe } from "lucide-react";

interface AboutSectionProps {
    about: {
        title: string;
        bio: string;
        skills: string[];
        imageUrl?: string;
    };
}

export default function AboutSection({ about }: AboutSectionProps) {
    return (
        <section id="about" className="relative py-10 overflow-hidden bg-white dark:bg-slate-900 border-y border-border">
            {/* Structural Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 -skew-x-12 transform origin-top" />

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Visual Side (Ironman/Discipline Inspiration) */}
                    <div className="lg:col-span-5 space-y-8">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-border group hover:border-brand-red transition-colors">
                                <CheckCircle className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold">Discipline</h4>
                                <p className="text-xs text-muted-text mt-1">Working with systems that ensure to deliver results.</p>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-border group hover:border-brand-gold transition-colors">
                                <Flame className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold">Passion</h4>
                                <p className="text-xs text-muted-text mt-1">Caring for creating impact and value.</p>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-border group hover:border-brand-red transition-colors">
                                <Zap className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold">Efficiency</h4>
                                <p className="text-xs text-muted-text mt-1">Success measured by results and impact not by hours or budget.</p>
                            </div>
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-border group hover:border-brand-red transition-colors">
                                <Target className="text-brand-gold mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold">Structured</h4>
                                <p className="text-xs text-muted-text mt-1">Comunication clear, agreements met, deadlines kept.</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:col-span-7 space-y-12">
                        <div className="space-y-4">
                            <h3 className="text-xl md:text-2xl font-black bg-brand-red/5 text-brand-red px-6 py-3 rounded-2xl inline-block border border-brand-red/10 uppercase tracking-widest font-display">
                                Core Identity
                            </h3>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="prose dark:prose-invert max-w-none text-muted-text lg:text-lg leading-relaxed font-sans"
                        >
                            <ReactMarkdown>{about.bio}</ReactMarkdown>
                        </motion.div>

                        {/* Skills Grid - The Sunlight/Travel Highlight */}
                        <div className="space-y-6 pt-8 border-t border-border">
                            <h4 className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
                                <Globe className="text-brand-gold" size={18} />
                                Global Competencies
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {about.skills.map((skill, idx) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="px-5 py-2.5 bg-background border border-border rounded-xl font-bold text-sm shadow-sm hover:border-brand-red hover:text-brand-red hover:shadow-brand-red/10 transition-all cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
