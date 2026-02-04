"use client";

import { useState, useEffect } from "react";
import {
    Mail,
    User,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Paperclip,
    DollarSign,
    Loader2,
    Search,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminContactMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "processed">("all");
    const [search, setSearch] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

    useEffect(() => {
        fetchMessages();
    }, [filter]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const query = filter === "all" ? "" : `?processed=${filter === "processed"}`;
            const res = await fetch(`/api/admin/contact${query}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data.messages || data.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleProcessed = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/contact/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ processed: !currentStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(messages.map(m => m._id === id ? { ...m, processed: !currentStatus } : m));
                if (selectedMessage?._id === id) {
                    setSelectedMessage({ ...selectedMessage, processed: !currentStatus });
                }
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">Contact Messages</h1>
                    <p className="text-gray-500">Manage inquiries from your portfolio.</p>
                </div>

                <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-2xl">
                    {(["all", "pending", "processed"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                                filter === t
                                    ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Messages List */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="space-y-3 h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="animate-spin text-blue-600" size={32} />
                            </div>
                        ) : filteredMessages.length > 0 ? (
                            filteredMessages.map((msg) => (
                                <button
                                    key={msg._id}
                                    onClick={() => setSelectedMessage(msg)}
                                    className={cn(
                                        "w-full text-left p-6 rounded-3xl border transition-all relative group",
                                        selectedMessage?._id === msg._id
                                            ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30"
                                            : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200"
                                    )}
                                >
                                    {!msg.processed && (
                                        <div className="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                    )}
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center font-bold text-gray-400">
                                            {msg.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{msg.name}</p>
                                            <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                                <Mail className="mx-auto text-gray-300 mb-4" size={40} />
                                <p className="text-gray-400 font-medium">No messages found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-7">
                    {selectedMessage ? (
                        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                                        {selectedMessage.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                                        <p className="text-gray-500 text-sm flex items-center gap-1">
                                            <Mail size={14} /> {selectedMessage.email}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleProcessed(selectedMessage._id, selectedMessage.processed)}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all",
                                        selectedMessage.processed
                                            ? "bg-green-50 text-green-600 dark:bg-green-900/10"
                                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    )}
                                >
                                    {selectedMessage.processed ? (
                                        <><Check size={18} /> Processed</>
                                    ) : (
                                        "Mark as Processed"
                                    )}
                                </button>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar size={12} /> Received
                                        </p>
                                        <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <DollarSign size={12} /> Budget
                                        </p>
                                        <p className="font-medium">{selectedMessage.projectBudget || "Not specified"}</p>
                                    </div>
                                    {selectedMessage.file && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <Paperclip size={12} /> Attachment
                                            </p>
                                            <a
                                                href={selectedMessage.file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 font-bold hover:underline line-clamp-1 inline-flex items-center gap-1"
                                            >
                                                View File <Eye size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={12} /> Message Content
                                    </p>
                                    <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: Your inquiry on my portfolio`}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:opacity-90 transition-all"
                                    >
                                        Reply via Email <Mail size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <div className="text-center p-12">
                                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Eye className="text-gray-300" size={32} />
                                </div>
                                <p className="text-gray-400 text-lg font-medium">Select a message to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
