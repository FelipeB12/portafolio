"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    PenTool,
    Mail,
    FileText,
    LogOut,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/admin" },
    { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
    { name: "Blog Posts", icon: PenTool, href: "/admin/blog" },
    { name: "Messages", icon: Mail, href: "/admin/contact" },
    { name: "CV Management", icon: FileText, href: "/admin/cv" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-black p-6 flex flex-col">
            <div className="mb-12 px-2">
                <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">A</div>
                    Admin Panel
                </h1>
            </div>

            <nav className="flex-grow space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={cn("transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                                <span className="font-semibold text-sm">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-semibold text-sm"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
