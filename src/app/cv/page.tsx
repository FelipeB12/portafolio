import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { Download, FileText, AlertCircle, ExternalLink } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `CV | ${siteConfig.name}`,
    description: "View and download my latest professional curriculum vitae.",
};

async function getActiveCv() {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseUrl}/api/cv`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Error fetching CV:", error);
        return null;
    }
}

export default async function CVPage() {
    const cv = await getActiveCv();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-5xl mx-auto px-4">
                    <header className="mb-16 text-center max-w-2xl mx-auto space-y-6">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Professional <span className="text-brand-red">CV</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Find a detailed overview of my experience, skills, and educational background.
                        </p>

                        <div className="flex justify-center gap-4 pt-4">
                            {cv ? (
                                <>
                                    <a
                                        href={cv.fileUrl}
                                        download
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-brand-red-hover transition-all shadow-xl shadow-brand-red/20"
                                    >
                                        <Download size={20} /> Download PDF
                                    </a>
                                    <a
                                        href={cv.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                    >
                                        <ExternalLink size={20} /> Full Screen
                                    </a>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400 italic">
                                    <AlertCircle size={20} />
                                    Currently unavailable
                                </div>
                            )}
                        </div>
                    </header>

                    {cv ? (
                        <div className="relative w-full aspect-[1/1.4] md:aspect-[1/1.3] bg-white rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group">
                            {/* Overlay for better mobile scroll behavior */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-red to-brand-gold z-10" />

                            <iframe
                                src={`${cv.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="w-full h-full border-none"
                                title={`${cv.fileName} PDF viewer`}
                            />

                            {/* Hint for interaction */}
                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                <p className="text-white text-sm font-medium">Use the download button for the best experience.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-40 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <FileText className="text-gray-300" size={48} />
                            </div>
                            <p className="text-gray-400 text-xl font-medium">The resume is being updated. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
