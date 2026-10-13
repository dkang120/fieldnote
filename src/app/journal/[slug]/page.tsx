import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/content/posts";
import { getScent } from "@/lib/scents";
import { ScentCard } from "@/components/ScentCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title, description: p.description, alternates: { canonical: `/journal/${p.slug}/` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();
  const related = p.related.map(getScent).filter((s): s is NonNullable<typeof s> => !!s);
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.description, datePublished: p.date,
        author: { "@type": "Organization", name: "Fieldnote" }, publisher: { "@type": "Organization", name: "Fieldnote" },
        mainEntityOfPage: `${SITE.url}/journal/${p.slug}/`,
      }} />
      <article className="wrap py-10 md:py-16">
        <nav aria-label="Breadcrumb" className="meta mb-6"><Link href="/journal/" className="no-underline hover:text-ink">Journal</Link></nav>
        <h1 className="mb-4 max-w-[18ch] text-[clamp(40px,5.5vw,72px)] leading-[1.02]">{p.title}</h1>
        <p className="meta mb-12"><time dateTime={p.date}>{new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time> · {p.readMinutes} min read</p>
        <div className="max-w-[64ch] font-serif text-[21px] leading-[1.6]">
          {p.body.map((b, i) => (
            <div key={i} className="mb-6">
              {b.h && <h2 className="mb-2 font-sans text-lg font-medium">{b.h}</h2>}
              <p>{b.p}</p>
            </div>
          ))}
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-paper-deep py-12 md:py-20">
          <div className="wrap">
            <h2 className="mb-8 text-h2">Scents in this story</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-7">
              {related.map((s) => <ScentCard key={s.slug} scent={s} list={`journal-${p.slug}`} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
