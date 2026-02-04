"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCVPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeCv, setActiveCv] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchActiveCv();
    }, []);

    const fetchActiveCv = async () => {
        try {
            const res = await fetch("/api/cv");
            const data = await res.json();
            if (data.success) {
                setActiveCv(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch CV", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setMessage({ type: "error", text: "Please select a PDF file." });
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setMessage({ type: "error", text: "File size must be less than 5MB." });
                return;
            }
            setFile(selectedFile);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/cv", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "CV uploaded and activated successfully!" });
                setActiveCv(data.data);
                setFile(null);
            } else {
                setMessage({ type: "error", text: data.error || "Failed to upload CV." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred during upload." });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold">Curriculum Vitae</h1>
                    <p className="text-gray-500">Manage your professional resume.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Upload className="text-blue-600" />
                        Upload New CV
                    </h2>

                    <div
                        className={cn(
                            "group relative border-2 border-dashed rounded-[2.5rem] p-8 text-center transition-all",
                            file ? "border-blue-500 bg-blue-50/10" : "border-gray-200 dark:border-gray-800 hover:border-blue-400"
                        )}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                <FileText className="text-blue-600" size={32} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-gray-100">
                                    {file ? file.name : "Click to select or drag PDF"}
                                </p>
                                <p className="text-sm text-gray-400">PDF up to 5MB</p>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl text-sm font-medium",
                            message.type === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/10" : "bg-red-50 text-red-700 dark:bg-red-900/10"
                        )}>
                            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Uploading...
                            </>
                        ) : (
                            "Activate New CV"
                        )}
                    </button>
                </div>

                {/* Status Section */}
                <div className="bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 space-y-8 flex flex-col">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Current Active CV
                    </h2>

                    <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                        {isLoading ? (
                            <Loader2 className="animate-spin text-gray-300" size={48} />
                        ) : activeCv ? (
                            <>
                                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-3xl flex items-center justify-center">
                                    <FileText className="text-green-600" size={48} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{activeCv.fileName}</p>
                                    <p className="text-sm text-gray-400">Uploaded on {new Date(activeCv.uploadedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-4 w-full">
                                    <a
                                        href={activeCv.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={16} /> View
                                    </a>
                                    <a
                                        href={activeCv.fileUrl}
                                        download
                                        className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} /> Download
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                                    <AlertCircle size={40} />
                                </div>
                                <p className="text-gray-400 font-medium">No CV uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
