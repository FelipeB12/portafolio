import { siteConfig } from "@/config/site";
import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Metadata for the About page
 */
export const metadata = {
    title: `About | ${siteConfig.name}`,
    description: "Learn more about my professional journey, discipline, and logical approach to engineering.",
};

/**
 * Server-side data fetching for about info
 */
async function getAboutData() {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const res = await fetch(`${baseUrl}/api/about`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Error fetching about data:", error);
        return null;
    }
}

export default async function AboutPage() {
    const aboutData = await getAboutData();

    const defaultAbout = {
        title: "Full-Stack Software Engineer",
        bio: "Passionate about building scalable digital solutions with discipline and logic.",
        skills: ["React", "TypeScript", "Node.js", "MongoDB", "DevOps"],
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-32 pb-24 font-sans">
                <div className="container max-w-7xl mx-auto px-4">
                    <header className="mb-15 text-center max-w-4xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-display uppercase leading-[1.1]">
                            Dedicated to the <br />
                            <span className="text-brand-red italic">Craft</span> of <span className="text-brand-red">Engineering</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-text max-w-3xl mx-auto font-medium mt-8 leading-relaxed">
                            {aboutData?.title || defaultAbout.title}. Passionate about building <span className="text-gray-900 dark:text-white font-bold">scalable digital solutions</span> with discipline and logic.
                        </p>
                    </header>
                </div>
                <AboutSection about={aboutData || defaultAbout} />
            </main>
            <Footer />
        </div>
    );
}
