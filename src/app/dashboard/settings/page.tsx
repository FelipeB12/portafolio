"use client";

import { Settings, User, Bell, Shield, Palette, Save } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <div className="space-y-12 pb-20">
            <header>
                <h1 className="text-4xl font-black tracking-tight">System <span className="text-blue-600">Settings</span></h1>
                <p className="text-gray-500 mt-1">Manage your administrative preferences and site configuration.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Navigation Tabs (Vertical) */}
                <div className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'profile', label: 'Admin Profile', icon: User, active: true },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'appearance', label: 'Appearance', icon: Palette },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${tab.active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-500 hover:bg-white dark:hover:bg-gray-800"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm p-10 md:p-12 space-y-12">

                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <User className="text-blue-600" />
                            Public Profile
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 ml-2">Display Name</label>
                                <input
                                    type="text"
                                    defaultValue="Felipe"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 ml-2">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="hello@felipe.dev"
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 ml-2">Bio Header</label>
                            <textarea
                                rows={3}
                                defaultValue="Product Designer & Full-stack Developer based in Colombia."
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                            />
                        </div>
                    </section>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Shield className="text-blue-600" />
                            Webhook Security
                        </h2>

                        <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-900/20 space-y-4">
                            <p className="text-sm text-blue-900/80 dark:text-blue-100/80 font-medium leading-relaxed">
                                Your webhook secret is used to sign payloads sent to n8n. If compromised, you can regenerate it here.
                            </p>
                            <div className="flex gap-4">
                                <input
                                    type="password"
                                    value="••••••••••••••••"
                                    readOnly
                                    className="flex-grow px-6 py-4 bg-white dark:bg-gray-900 border-none rounded-2xl text-sm"
                                />
                                <button className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm hover:opacity-90">
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="pt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Settings"}
                            <Save size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
