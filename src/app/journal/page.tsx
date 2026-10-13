import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/content/posts";

export const metadata: Metadata = {
  title: "Journal",
  description: "Scent notes, how-tos and the story behind every bottle from the Fieldnote bench.",
  alternates: { canonical: "/journal/" },
};

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function JournalPage() {
  return (
    <section className="py-10 md:py-16">
      <div className="wrap">
        <h1 className="mb-4 text-display">Journal</h1>
        <p className="lede mb-12">Notes from the bench: what things smell like, how to wear them, and why we work the way we do.</p>
        <ol className="border-t border-ink">
          {[...POSTS].sort((a, b) => b.date.localeCompare(a.date)).map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link href={`/journal/${p.slug}/`} className="grid gap-2 py-8 no-underline md:grid-cols-[180px_1fr_1fr] md:gap-8">
                <time dateTime={p.date} className="meta">{fmt(p.date)}</time>
                <h2 className="text-h3 underline-offset-4 hover:underline">{p.title}</h2>
                <p className="text-muted">{p.description}</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
