import { createFileRoute, notFound } from "@tanstack/react-router";
import { blogPostHead, BlogPostView } from "./blog.$slug";
import { getBlogPost } from "@/data/blog-posts";

export const Route = createFileRoute("/$locale/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => blogPostHead(params.slug, params.locale),
  component: LocaleBlogPostPage,
});

function LocaleBlogPostPage() {
  const { slug } = Route.useLoaderData();
  return <BlogPostView slug={slug} />;
}

