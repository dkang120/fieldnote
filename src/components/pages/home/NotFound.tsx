/* 404, built from Figma: desktop 172:2266, phone 172:2225 ("Not found" sections 172:2282 / 172:2240). */
import { Button, TextLink } from "@/components/site/ui";

export function NotFoundDesktop() {
  return (
    <section className="relative h-[570px] w-[1440px] overflow-clip">
      <h1 className="absolute left-[80px] top-[200px] w-[900px] font-serif font-normal leading-none text-[56px] tracking-[-0.56px] text-[#2b231f]">
        This page doesn&apos;t exist.
      </h1>
      <div className="absolute left-[80px] top-[280px] flex gap-[32px] items-start">
        <Button href="/scents/">See house scents</Button>
        <TextLink href="/">Back to home</TextLink>
      </div>
    </section>
  );
}

export function NotFoundPhone() {
  return (
    <section className="relative h-[368px] w-[390px] overflow-clip">
      <h1 className="absolute left-[16px] top-[96px] w-[358px] font-serif font-normal leading-[1.05] text-[36px] tracking-[-0.36px] text-[#2b231f]">
        This page doesn&apos;t exist.
      </h1>
      <div className="absolute left-[16px] top-[158px] flex flex-col gap-[16px] items-start">
        <Button href="/scents/">See house scents</Button>
        <TextLink href="/">Back to home</TextLink>
      </div>
    </section>
  );
}
