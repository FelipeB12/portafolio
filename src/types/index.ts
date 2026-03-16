export interface BlogEditorData {
    title: string;
    slug: string;
    excerpt: string;
    contentMarkdown: string;
    tags: string[];
    coverImage: string;
}

export interface Screenshot {
    url: string;
    alt: string;
}

export interface ProjectEditorData {
    title: string;
    slug: string;
    shortDescription: string;
    problem: string;
    solution: string;
    role: string;
    techStack: string[];
    keyDecisions: string[];
    screenshots: Screenshot[];
    liveLink: string;
    githubLink: string;
    featured: boolean;
}

export interface DashboardProject extends ProjectEditorData {
    _id: string;
    createdAt: string;
}

export interface DashboardPost extends BlogEditorData {
    _id: string;
    publishedAt?: string;
    createdAt: string;
}

export interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    processed: boolean;
    createdAt: string;
    projectBudget?: string;
    file?: {
        url: string;
        name: string;
    };
}
