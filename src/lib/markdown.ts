import { remark } from "remark";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

/**
 * Converts markdown string to safe HTML string with syntax highlighting,
 * auto-slugs for headings, and GFM support.
 */
export async function markdownToHtml(markdown: string) {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
            behavior: "wrap",
        })
        .use(rehypeStringify)
        .process(markdown);

    return result.toString();
}

/**
 * Strips markdown to get plain text for excerpts or search metadata.
 */
export async function stripMarkdown(markdown: string) {
    const result = await remark().use(remarkGfm).process(markdown);
    return result
        .toString()
        .replace(/[#*`_~]/g, "") // Basic stripping
        .slice(0, 160);
}
