import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-32 pb-24">
                <div className="container max-w-4xl mx-auto px-4 space-y-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight">Privacy <span className="text-brand-gold">Policy</span></h1>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-xl text-muted-text leading-relaxed">
                            I value your privacy. This site only collects data necessary for authentication and contact form submissions.
                        </p>
                        <h2 className="text-2xl font-bold pt-8">Data Collection</h2>
                        <p>When you sign in via GitHub, we only store your basic profile information (name, email, avatar) to manage your session.</p>
                        <h2 className="text-2xl font-bold pt-8">Cookies</h2>
                        <p>We use essential cookies to keep you signed in. No tracking or third-party marketing cookies are used.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
