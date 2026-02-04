"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Screenshot {
    url: string;
    alt?: string;
}

export default function ProjectGallery({ screenshots }: { screenshots: Screenshot[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!screenshots || screenshots.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screenshots.map((item, index) => (
                    <div
                        key={index}
                        className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer border border-gray-100 dark:border-gray-800"
                        onClick={() => setSelectedIndex(index)}
                    >
                        <Image
                            src={item.url}
                            alt={item.alt || `Screenshot ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12"
                    >
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={32} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={screenshots[selectedIndex].url}
                                alt={screenshots[selectedIndex].alt || "Gallary image"}
                                width={1920}
                                height={1080}
                                className="max-w-full max-h-full object-contain rounded-xl"
                            />

                            {screenshots.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedIndex((selectedIndex - 1 + screenshots.length) % screenshots.length);
                                        }}
                                        className="absolute left-0 text-white/50 hover:text-white p-4"
                                    >
                                        <ChevronLeft size={48} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedIndex((selectedIndex + 1) % screenshots.length);
                                        }}
                                        className="absolute right-0 text-white/50 hover:text-white p-4"
                                    >
                                        <ChevronRight size={48} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
                            {selectedIndex + 1} / {screenshots.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
