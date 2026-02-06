import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-4xl mx-auto px-4 space-y-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight">Terms of <span className="text-brand-red">Service</span></h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-xl text-muted-text leading-relaxed">
                            This is a personal portfolio website. By using this site, you agree to look at the cool projects and read the technical blog posts.
                        </p>
                        <h2 className="text-2xl font-bold pt-8">Usage</h2>
                        <p>The content on this site is for demonstration purposes for my professional work as a software engineer.</p>
                        <h2 className="text-2xl font-bold pt-8">Contact</h2>
                        <p>If you have any questions, please use the contact form on this site.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
