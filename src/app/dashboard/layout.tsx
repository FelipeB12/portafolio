"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black text-gray-900 dark:text-gray-100 flex">
            <Toaster position="top-right" />
            {/* The Sidebar toggle logic should ideally be in a context if needed elsewhere, 
                but for now we'll match the CSS behavior or use a shared state if we move toggle here.
                Since AdminSidebar handles its own state, we'll use CSS classes to match.
            */}
            <AdminSidebar />

            <main className="flex-grow transition-all duration-300 ml-0 md:ml-72">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* In a real implementation, we'd sync the isCollapsed state with the Sidebar 
                via context or a state hoisting to ensuring the margin-left matches perfectly.
                For now, let's assume the sidebar is 72 (md:ml-72).
            */}
        </div>
    );
}
