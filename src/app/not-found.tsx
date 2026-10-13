import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-24">
      <h1 className="mb-4 text-h2">This page doesn't exist.</h1>
      <p className="lede mb-8">The link may be old. Every scent is on the house scents page.</p>
      <Link href="/scents/" className="btn">See house scents</Link>
    </section>
  );
}
