import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
            <div className="container max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-black tracking-tighter mb-4 block uppercase font-display">
                            {siteConfig.name}<span className="text-brand-red">.</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                            {siteConfig.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href={siteConfig.links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-text hover:text-brand-red transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href={siteConfig.links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-muted-text hover:text-brand-red transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href={`mailto:${siteConfig.links.email}`}
                                className="p-2 text-muted-text hover:text-brand-red transition-colors"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 uppercase text-xs tracking-widest text-gray-400">Navigation</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Home</Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Projects</Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Blog</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 uppercase text-xs tracking-widest text-gray-400">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/privacy" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-text hover:text-brand-red transition-colors font-medium text-sm">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
                    <p>Built with Next.js, TypeScript & Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
}
