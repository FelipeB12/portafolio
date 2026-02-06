"use client";

import { useState, useEffect } from "react";
import { User, FileText, CheckCircle, AlertCircle, Loader2, Save, Image as ImageIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function AboutEditorPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        bio: "",
        imageUrl: "",
        skills: [] as string[],
    });

    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await fetch("/api/about");
            const data = await res.json();
            if (data.success) {
                setFormData({
                    title: data.data.title || "",
                    bio: data.data.bio || "",
                    imageUrl: data.data.imageUrl || "",
                    skills: data.data.skills || [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch about data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/about", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "About profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update profile." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred during save." });
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-brand-red" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex justify-between items-center bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <User className="text-brand-red" />
                        About Me Editor
                    </h1>
                    <p className="text-muted-text">Tell your story and showcase your skills.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            {message && (
                <div className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2",
                    message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-brand-red border border-red-100"
                )}>
                    {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Side */}
                <div className="space-y-8">
                    <div className="bg-card p-8 rounded-[3rem] border border-border space-y-6">
                        <h2 className="text-xl font-bold">Identity & Bio</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-text uppercase tracking-wider ml-2">Professional Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Senior Software Engineer & UI/UX Designer"
                                className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-text uppercase tracking-wider ml-2">Biography (Markdown)</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={12}
                                placeholder="Write your professional story here..."
                                className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-card p-8 rounded-[3rem] border border-border space-y-6">
                        <h2 className="text-xl font-bold">Skills & Technologies</h2>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                placeholder="Add a skill (e.g. React, NoSQL)"
                                className="flex-grow px-6 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-brand-red outline-none transition-all"
                            />
                            <button
                                onClick={addSkill}
                                className="px-6 py-4 bg-brand-gold text-white rounded-2xl font-bold hover:bg-brand-gold-hover transition-all"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-foreground rounded-xl flex items-center gap-2 font-medium border border-slate-200 dark:border-slate-700"
                                >
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-brand-red">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview Side */}
                <div className="space-y-8 h-fit lg:sticky lg:top-8">
                    <div className="bg-card p-8 rounded-[3rem] border border-border space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Preview
                            <span className="text-xs font-normal px-2 py-1 bg-brand-gold/10 text-brand-gold rounded-md border border-brand-gold/20 uppercase tracking-tighter">Live Editor</span>
                        </h2>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-black text-brand-red">{formData.title || "Your Title"}</h3>
                            <div className="text-muted-text whitespace-pre-wrap leading-relaxed">
                                {formData.bio ? (
                                    <ReactMarkdown>{formData.bio}</ReactMarkdown>
                                ) : (
                                    "Your bio preview will appear here..."
                                )}
                            </div>
                        </div>

                        {formData.skills.length > 0 && (
                            <div className="pt-6 border-t border-border">
                                <h4 className="text-sm font-bold text-muted-text uppercase tracking-widest mb-4">Core Competencies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-brand-red/5 text-brand-red border border-brand-red/10 rounded-lg text-sm font-bold uppercase tracking-wider">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
