/* Home, built from Figma: desktop 8:2, phone 10:399, tablet 174:2231. Positions are absolute px from the frames. */
import Link from "next/link";
import type { ReactNode } from "react";
import { asset } from "@/lib/site";
import { HeaderDesktop } from "@/components/site/Chrome";
import { Button, TextLink } from "@/components/site/ui";
import { ArrowRight, Plus } from "@/components/icons";

const img = (name: string) => asset(`/img/home/${name}`);

function Img({ src, className = "", alt = "", eager = false }: { src: string; className?: string; alt?: string; eager?: boolean }) {
  return <img alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" src={img(src)} className={`absolute max-w-none object-cover ${className}`} />;
}

const EYEBROW = "font-sans font-medium leading-[1.3] text-[12px] tracking-[0.72px] uppercase whitespace-nowrap";
const MONO_EYEBROW = "font-mono font-normal leading-[1.3] text-[12px] tracking-[1.6px] uppercase text-[#6b625b] whitespace-nowrap";

const PRODUCTS = [
  { name: "Library Musk", slug: "library-musk", notes: "Aldehydes, Musk", img: "bottle.webp" },
  { name: "Fig Study", slug: "fig-study", notes: "Fig Leaf, Cedar", img: "bottle.webp" },
  { name: "Field Vetiver", slug: "field-vetiver", notes: "Grapefruit, Vetiver", img: "bottle-twig.webp" },
  { name: "Late Tea", slug: "late-tea", notes: "Black Tea, Amber", img: "bottle.webp" },
];

const VALUES = [
  { label: "Genderless Fragrances", icon: "icon-genderless.png" },
  { label: "Vegan & Cruelty-Free", icon: "icon-vegan.png" },
  { label: "Filled to Order", icon: "icon-filled.png" },
  { label: "Exceptional Ingredients", icon: "icon-ingredients.png" },
];

/** Product card: image, name row with plus, notes, price. `w`/`imgW`/`imgH` from the frame. */
function Card({ p, x, y, w, imgW, imgH }: { p: (typeof PRODUCTS)[number]; x: number; y: number; w: number; imgW: number; imgH: number }) {
  return (
    <Link href={`/scents/${p.slug}/`} className="absolute block group" style={{ left: x, top: y, width: w, height: imgH + 88 }}>
      <img alt={p.name} loading="lazy" decoding="async" src={img(p.img)} className="absolute left-0 top-0 max-w-none object-cover" style={{ width: imgW, height: imgH }} />
      <div className="absolute left-0 font-sans font-normal whitespace-nowrap" style={{ top: imgH + 22, width: w }}>
        <p className="leading-[1.5] text-[16px] text-[#2b231f] group-hover:underline">{p.name}</p>
        <Plus className="absolute right-0 top-[5px] size-[14px] text-[#2b231f] [stroke-width:1.714]" />
        <p className="leading-[1.5] text-[14px] text-[#6b625b] !translate-y-0">{p.notes}</p>
        <p className="leading-[1.5] text-[14px] text-[#2b231f] !translate-y-0">From $78</p>
      </div>
    </Link>
  );
}

function SeeAll({ x, y }: { x: number; y: number }) {
  return (
    <Link href="/scents/" className="absolute flex items-center gap-[6px] link-hover" style={{ left: x, top: y }}>
      <span className="font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap">See all</span>
      <ArrowRight className="size-[12px] text-[#2b231f] [stroke-width:2]" />
    </Link>
  );
}

/** Caption under a Notes photo: roman numeral + italic serif name, baseline-aligned. */
function NoteCaption({ n, label, size, gap, flat = false }: { n: string; label: string; size: number; gap: number; flat?: boolean }) {
  return (
    <div className={`flex items-baseline leading-[1.3] whitespace-nowrap ${flat ? "[&_span]:!translate-y-0" : ""}`} style={{ gap }}>
      <span className={`${EYEBROW} text-[#6b625b]`}>{n}</span>
      <span className="font-serif italic text-[#2b231f]" style={{ fontSize: size }}>{label}</span>
    </div>
  );
}

function Abs({ x, y, w, className = "", children }: { x: number; y: number; w?: number; className?: string; children: ReactNode }) {
  return <div className={`absolute ${className}`} style={{ left: x, top: y, width: w }}>{children}</div>;
}

const ULINK = "font-sans font-normal leading-[1.5] text-[14px] underline underline-offset-[4px] [text-decoration-skip-ink:none] decoration-from-font whitespace-nowrap link-hover translate-y-px";

/* ───────────────────────── Desktop 1440 ───────────────────────── */

export function HomeDesktop() {
  return (
    <div className="relative pt-[35px]">
      <HeaderDesktop
        className={[
          "absolute left-0 top-0",
          "[&>div:nth-child(2)]:!bg-transparent [&>div:nth-child(2)]:!border-b-0",
          "[&_nav_a]:!text-white [&_nav_a:nth-child(4)]:!text-[#6b625b]",
          "[&>div:nth-child(2)>a]:!text-white [&_button]:!text-white [&_button_span]:!text-white",
        ].join(" ")}
      />

      {/* Hero 8:19 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative h-[900px] w-[1440px] overflow-clip">
        <Img src="hero-d.webp" className="inset-0 size-full" eager />
        <div className="absolute left-[80px] top-[211px] flex flex-col gap-[16px] items-start">
          <div className="flex flex-col gap-[40px] items-start">
            <div className="flex flex-col gap-[28px] items-start">
              <p className={`${EYEBROW} text-[#ede6d6]`}>Fresh-filled cologne · Los Angeles</p>
              <h1 className="!translate-y-0 font-serif font-normal leading-[0.92] text-[150px] tracking-[-3px] text-[#ede6d6] whitespace-nowrap">
                Made the day<br />
                <span className="italic">you order it.</span>
              </h1>
            </div>
            <div className="flex gap-[24px] items-center">
              <Link href="/scents/#find" className="bg-white flex h-[40px] items-center justify-center px-[20px] rounded-[999px] transition-opacity hover:opacity-80">
                <span className="font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] whitespace-nowrap">Find your scent</span>
              </Link>
              <TextLink href="/build/" arrow={false} textClass="text-[16px] leading-[1.5] text-white">Make your label</TextLink>
            </div>
          </div>
          <div className="font-sans font-normal leading-[1.5] text-[14px] text-[#f4f0e8] whitespace-nowrap [&_p]:!translate-y-0">
            <p>From $78</p>
            <p>$22 Discovery Set applies to your first bottle</p>
            <p>Ships the next weekday after filling</p>
          </div>
        </div>
      </section>

      {/* Intro 30:1692 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[655px] w-[1440px] overflow-clip">
        <Img src="intro-light.webp" className="left-[28px] top-[67px] w-[400px] h-[520px]" />
        <Img src="intro-dark.webp" className="left-[434px] top-[67px] w-[370px] h-[520px]" />
        <div className="absolute left-[955.5px] top-[239.5px] w-[265px] flex flex-col items-center font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] text-center whitespace-nowrap">
          <h2 className="font-normal !translate-y-0">The Fieldnote process</h2>
          <p className="mt-[30px]">
            Fieldnote is scent made the day you order it.<br />
            Nothing sits on a shelf — every bottle is blended,<br />
            fresh-filled, and labeled with your name by hand.<br />
            Small batch, unhurried, and made to be yours<br />
            from the first spray to the last.
          </p>
          <Link href="/build/" className="mt-[40px] link-hover translate-y-px">Explore</Link>
        </div>
      </section>

      {/* Mood 43:1616 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#2b231f] h-[1520px] w-[1440px] overflow-clip">
        <Img src="mood-skin-d.webp" className="left-0 top-0 w-[1440px] h-[760px]" />
        <Img src="mood-product-d.webp" className="left-0 top-[760px] w-[1440px] h-[760px]" />
        {[
          { x: 48, t: ["Worn", "Personal", "Intimate", "Unhurried"] },
          { x: 288, t: ["Skin", "Amber glass", "Morning light", "Printed labels"] },
          { x: 558, t: ["Mood:", "Grounded", "Warm", "Yours"] },
        ].map((c) => (
          <Abs key={c.x} x={c.x} y={810} className="font-sans font-normal leading-[1.5] text-[14px] text-[#f4f0e8] whitespace-nowrap [&_p]:!translate-y-0">
            {c.t.map((l) => <p key={l}>{l}</p>)}
          </Abs>
        ))}
      </section>

      {/* Notes — Fig Study 174:2767 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[1080px] w-[1440px] overflow-clip">
        <div className="absolute left-[420px] top-[120px] w-[600px] flex flex-col items-center text-center">
          <p className={`${EYEBROW} text-[#6b625b]`}>No. 02</p>
          <h2 className="mt-[18px] font-serif font-normal leading-none text-[64px] text-[#2b231f] whitespace-nowrap">Fig <span className="italic">Study</span></h2>
          <p className="mt-[20px] font-sans font-normal leading-[1.5] text-[16px] text-[#6b625b] whitespace-nowrap">Fig leaf and cedar.</p>
        </div>
        {[
          { x: 80, y: 400, w: 440, h: 546, src: "leaf.webp", n: "I", l: "The leaf" },
          { x: 600, y: 560, w: 300, h: 372, src: "fruit.webp", n: "II", l: "The fruit" },
          { x: 980, y: 330, w: 380, h: 472, src: "wood.webp", n: "III", l: "The wood" },
        ].map((f) => (
          <div key={f.n} className="absolute flex flex-col gap-[14px] items-start" style={{ left: f.x, top: f.y, width: f.w }}>
            <div className="relative" style={{ width: f.w, height: f.h }}><Img src={f.src} className="inset-0 size-full" /></div>
            <NoteCaption n={f.n} label={f.l} size={20} gap={14} flat />
          </div>
        ))}
        <p className="absolute left-[980px] top-[870px] w-[320px] font-sans font-normal leading-[1.65] text-[16px] text-[#6b625b]">
          Green and a little bitter at first, then warm and dry as it settles on skin.
        </p>
      </section>

      {/* Bench 174:2763 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative h-[760px] w-[1440px] overflow-clip">
        <Img src="bench-d.webp" className="inset-0 size-full" />
        <p className={`absolute left-[80px] top-[688px] ${EYEBROW} text-[#f4f0e8]`}>The bench · Los Angeles</p>
      </section>

      {/* The label 174:2790 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[960px] w-[1440px] overflow-clip">
        <Img
          src="label-d.webp"
          className="left-[80px] top-[100px] w-[640px] h-[760px]"
          alt="Example label: Fig Study, made for Avery M., Los Angeles, CA, 14 Oct 2026, 50 ml"
        />
        <div className="absolute left-[840px] top-[300px] w-[400px] flex flex-col items-start">
          <p className={`${EYEBROW} text-[#6b625b]`}>The label</p>
          <h2 className="mt-[28px] h-[150px] font-serif font-normal leading-[1.04] text-[48px] text-[#2b231f] whitespace-nowrap">
            Your name,<br />your city,<br /><span className="italic">the day it was made.</span>
          </h2>
          <p className="mt-[28px] h-[78px] w-[340px] font-sans font-normal leading-[1.65] text-[16px] text-[#6b625b]">
            Nothing is mixed until you order it. We fill your bottle by hand and print the label for you alone. It comes with you to any scent you choose.
          </p>
          <div className="mt-[40px] flex">
            <Link href="/build/" className={`${ULINK} w-[134px] text-[#2b231f]`}>Make your label</Link>
            <Link href="/scents/#find" className={`${ULINK} text-[#6b625b]`}>Find your scent</Link>
          </div>
        </div>
      </section>

      {/* Discovery Set 174:2818 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[920px] w-[1440px] overflow-clip">
        <Img src="discovery.webp" className="left-[440px] top-[40px] w-[920px] h-[720px]" alt="The six house scents in Discovery vials" />
        <div className="absolute left-[80px] top-[477px] w-[320px] flex flex-col items-start">
          <p className={`${EYEBROW} text-[#6b625b]`}>The Discovery Set</p>
          <h2 className="!translate-y-[2px] mt-[24px] h-[84px] font-serif font-normal leading-[1.04] text-[40px] text-[#2b231f] whitespace-nowrap">
            Six scents,<br /><span className="italic">before you choose one.</span>
          </h2>
          <p className="mt-[24px] h-[78px] w-[300px] font-sans font-normal leading-[1.65] text-[16px] text-[#6b625b]">
            All six house scents in 2 ml vials, to wear on your own time. $22, credited to your first bottle.
          </p>
          <Link href="/discovery/" className={`mt-[36px] ${ULINK} text-[#2b231f]`}>Begin with all six</Link>
        </div>
      </section>

      {/* Products 8:51 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[490px] w-[1440px] overflow-clip">
        <h2 className="absolute left-[58px] top-[44px] font-sans font-normal leading-[1.4] text-[12px] text-[#6b625b] whitespace-nowrap">House scents</h2>
        <SeeAll x={1329} y={44} />
        {PRODUCTS.map((p, i) => <Card key={p.slug} p={p} x={58.5 + 336 * i} y={91} w={315} imgW={315} imgH={302} />)}
      </section>

      {/* Values 47:1615 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[240px] w-[1440px] overflow-clip">
        {VALUES.map((v, i) => {
          const col = [{ x: 180, w: 150 }, { x: 474.5, w: 145 }, { x: 796.5, w: 98 }, { x: 1044.5, w: 160 }][i];
          return (
            <div key={v.label} className="absolute flex flex-col items-center" style={{ left: col.x, top: 66, width: col.w }}>
              <img alt="" loading="lazy" decoding="async" src={img(v.icon)} className="size-[44px]" />
              <p className="mt-[45px] font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] text-center whitespace-nowrap !translate-y-0">{v.label}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ───────────────────────── Phone 390 ───────────────────────── */

export function HomePhone() {
  return (
    <>
      {/* Hero 103:2033 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#2b231f] h-[680px] w-[390px] overflow-clip">
        <Img src="hero-p.webp" className="inset-0 size-full" eager />
        <p className={`absolute left-[16px] top-[286px] ${EYEBROW} text-[#ede6d6]`}>Fresh-filled cologne · Los Angeles</p>
        <h1 className="absolute left-[16px] top-[330px] font-serif font-normal leading-[0.94] text-[64px] tracking-[-1.28px] text-[#ede6d6] whitespace-nowrap">
          Made the day<br />
          <span className="italic">you order it.</span>
        </h1>
        <div className="absolute left-[16px] top-[474px] w-[358px] font-sans font-normal leading-[1.5] text-[14px] text-[#f4f0e8] [&_p]:!translate-y-0">
          <p>From $78</p>
          <p>$22 Discovery Set applies to your first bottle</p>
          <p>Ships the next weekday after filling</p>
        </div>
        <Button href="/scents/#find" className="absolute left-[16px] top-[560px] w-[358px] h-[48px]"><span>FIND YOUR SCENT</span></Button>
        <Link href="/build/" className="absolute left-[143px] top-[620px] h-[44px] flex items-center link-hover">
          <span className="font-sans font-normal leading-[1.5] text-[16px] text-[#ede6d6] whitespace-nowrap">Make your label</span>
        </Link>
      </section>

      {/* Intro 103:2046 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[1366px] w-[390px] overflow-clip">
        <Img src="intro-light.webp" className="left-[16px] top-[64px] w-[358px] h-[466px]" />
        <Img src="intro-dark.webp" className="left-[16px] top-[536px] w-[358px] h-[466px]" />
        <h2 className="absolute left-0 top-[1062px] w-[390px] text-center font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f]">The Fieldnote process</h2>
        <p className="absolute left-[16px] top-[1137px] w-[358px] text-center font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] !translate-y-0">
          Fieldnote is scent made the day you order it. Nothing sits on a shelf — every bottle is blended, fresh-filled, and labeled with your name by hand. Small batch, unhurried, and made to be yours from the first spray to the last.
        </p>
        <Link href="/build/" className="absolute left-[174.5px] top-[1289px] font-sans font-normal leading-[1.4] text-[12px] text-[#2b231f] link-hover translate-y-px">Explore</Link>
      </section>

      {/* Mood 103:2055 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#2b231f] h-[1040px] w-[390px] overflow-clip">
        <Img src="mood-skin.webp" className="left-0 top-0 w-[390px] h-[520px]" />
        <Img src="mood-product.webp" className="left-0 top-[520px] w-[390px] h-[520px]" />
        <div className="absolute left-0 top-[520px] w-[390px] h-[260px] bg-[linear-gradient(180deg,rgba(43,35,31,0.55)_0%,rgba(43,35,31,0)_100%)]" />
        {[
          { y: 552, t: ["Worn", "Personal", "Intimate", "Unhurried"] },
          { y: 652, t: ["Skin", "Amber glass", "Morning light", "Printed labels"] },
          { y: 752, t: ["Mood:", "Grounded", "Warm", "Yours"] },
        ].map((c) => (
          <Abs key={c.y} x={16} y={c.y} className="font-sans font-normal leading-[1.5] text-[14px] text-[#f4f0e8] whitespace-nowrap [&_p]:!translate-y-0">
            {c.t.map((l) => <p key={l}>{l}</p>)}
          </Abs>
        ))}
      </section>

      {/* Bench 175:2643 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative h-[600px] w-[390px] overflow-clip">
        <Img src="bench-p.webp" className="inset-0 size-full" />
        <p className="!translate-y-0 absolute left-[16px] top-[480px] font-serif italic leading-[1.1] text-[26px] text-[#f4f0e8] whitespace-nowrap">
          Filled by hand,<br />within forty-eight hours.
        </p>
        <p className={`absolute left-[16px] top-[552px] ${EYEBROW} text-[#f4f0e8]`}>The bench · Los Angeles</p>
      </section>

      {/* Notes — Fig Study 175:2648 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[1046px] w-[390px] overflow-clip">
        <div className="absolute left-[16px] top-[72px] w-[358px] flex flex-col items-center text-center">
          <p className={`${EYEBROW} text-[#6b625b]`}>No. 02</p>
          <h2 className="!translate-y-0 mt-[14px] font-serif font-normal leading-none text-[40px] text-[#2b231f] whitespace-nowrap">Fig <span className="italic">Study</span></h2>
          <p className="!translate-y-0 mt-[14px] font-sans font-normal leading-[1.5] text-[14px] text-[#6b625b] whitespace-nowrap">Fig leaf and cedar.</p>
        </div>
        {[
          { x: 16, y: 236, w: 240, h: 298, src: "leaf.webp", n: "I", l: "The leaf" },
          { x: 214, y: 580, w: 160, h: 198, src: "fruit.webp", n: "II", l: "The fruit" },
          { x: 16, y: 640, w: 176, h: 218, src: "wood.webp", n: "III", l: "The wood" },
        ].map((f) => (
          <div key={f.n} className="absolute flex flex-col gap-[10px] items-start" style={{ left: f.x, top: f.y, width: f.w }}>
            <div className="relative" style={{ width: f.w, height: f.h }}><Img src={f.src} className="inset-0 size-full" /></div>
            <NoteCaption n={f.n} label={f.l} size={18} gap={10} />
          </div>
        ))}
        <p className="absolute left-[16px] top-[930px] w-[280px] font-sans font-normal leading-[1.6] text-[14px] text-[#6b625b]">
          Green and a little bitter at first, then warm and dry as it settles on skin.
        </p>
      </section>

      {/* The label 175:2671 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[881px] w-[390px] overflow-clip">
        <Img src="label-p.webp" className="left-[16px] top-[64px] w-[358px] h-[460px]" alt="Example label: Fig Study, made for Avery M., Los Angeles, CA" />
        <div className="absolute left-[16px] top-[560px] w-[358px] flex flex-col items-start">
          <p className={`${EYEBROW} text-[#6b625b]`}>The label</p>
          <h2 className="!translate-y-0 mt-[18px] h-[74px] font-serif font-normal leading-[1.04] text-[36px] tracking-[-0.36px] text-[#2b231f] whitespace-nowrap">
            Your name, your city,<br /><span className="italic">the day it was made.</span>
          </h2>
          <p className="mt-[18px] h-[66px] w-[340px] font-sans font-normal leading-[1.6] text-[14px] text-[#6b625b]">
            Nothing is mixed until you order it. We fill your bottle by hand and print the label for you alone. It comes with you to any scent you choose.
          </p>
          <div className="mt-[28px] flex">
            <Link href="/build/" className={`${ULINK} w-[126px] text-[#2b231f]`}>Make your label</Link>
            <Link href="/scents/#find" className={`${ULINK} text-[#6b625b]`}>Find your scent</Link>
          </div>
        </div>
      </section>

      {/* Discovery Set 175:2693 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[639px] w-[390px] overflow-clip">
        <Img src="discovery.webp" className="left-0 top-0 w-[390px] h-[292px]" alt="The six house scents in Discovery vials" />
        <div className="absolute left-[16px] top-[332px] w-[358px] flex flex-col items-start">
          <p className={`${EYEBROW} text-[#6b625b]`}>The Discovery Set</p>
          <h2 className="!translate-y-0 mt-[18px] h-[74px] font-serif font-normal leading-[1.04] text-[36px] tracking-[-0.36px] text-[#2b231f] whitespace-nowrap">
            Six scents,<br /><span className="italic">before you choose one.</span>
          </h2>
          <p className="mt-[18px] h-[44px] w-[320px] font-sans font-normal leading-[1.6] text-[14px] text-[#6b625b]">
            All six house scents in 2 ml vials, to wear on your own time. $22, credited to your first bottle.
          </p>
          <Link href="/discovery/" className={`mt-[28px] ${ULINK} text-[#2b231f]`}>Begin with all six</Link>
        </div>
      </section>

      {/* House scents 103:2062 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[603px] w-[390px] overflow-clip">
        <h2 className="absolute left-[16px] top-[32px] font-sans font-normal leading-[1.4] text-[12px] text-[#6b625b] whitespace-nowrap">House scents</h2>
        <SeeAll x={321} y={32} />
        {PRODUCTS.map((p, i) => (
          <Card key={p.slug} p={p} x={i % 2 ? 203 : 16} y={i < 2 ? 69 : 328} w={171} imgW={171} imgH={164} />
        ))}
      </section>

      {/* Values 103:2114 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[288px] w-[390px] overflow-clip">
        {VALUES.map((v, i) => (
          <div key={v.label} className="absolute flex flex-col items-center w-[170px]" style={{ left: i % 2 ? 203 : 16, top: i < 2 ? 32 : 156 }}>
            <img alt="" loading="lazy" decoding="async" src={img(v.icon)} className="size-[44px]" />
            <p className="mt-[16px] font-sans font-normal leading-[1.5] text-[14px] text-[#2b231f] text-center !translate-y-0">{v.label}</p>
          </div>
        ))}
      </section>
    </>
  );
}

/* ───────────────────────── Tablet 768 ───────────────────────── */

export function HomeTablet() {
  return (
    <>
      {/* Hero 174:2246 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative h-[820px] w-[768px] overflow-clip">
        <Img src="hero-t.webp" className="inset-0 size-full" eager />
        <p className={`absolute left-[32px] top-[435px] ${EYEBROW} text-[#ede6d6]`}>Fresh-filled cologne · Los Angeles</p>
        <h1 className="absolute left-[32px] top-[475px] font-serif font-normal leading-[0.94] text-[64px] tracking-[-1.28px] text-[#ede6d6] whitespace-nowrap">
          Made the day<br />
          <span className="italic">you order it.</span>
        </h1>
        <div className="absolute left-[32px] top-[619px] flex gap-[24px] items-center">
          <Button href="/scents/#find" variant="onInk" className="h-[50px] w-[177px]"><span>Find your scent</span></Button>
          <TextLink href="/build/" arrow={false} textClass="text-[16px] leading-[1.5] text-[#ede6d6]">Make your label</TextLink>
        </div>
        <div className="absolute left-[32px] top-[693px] w-[704px] font-sans font-normal leading-[1.5] text-[14px] text-[#ede6d6] [&_p]:!translate-y-0">
          <p>From $78</p>
          <p>$22 Discovery Set applies to your first bottle</p>
          <p>Ships the next weekday after filling</p>
        </div>
      </section>

      {/* Intro 174:2261 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[761px] w-[768px] overflow-clip">
        <Img src="intro-light.webp" className="left-[32px] top-[80px] w-[344px] h-[440px]" />
        <Img src="intro-dark.webp" className="left-[392px] top-[80px] w-[344px] h-[440px]" />
        <h2 className={`absolute left-[32px] top-[552px] ${MONO_EYEBROW}`}>The Fieldnote process</h2>
        <p className="absolute left-[32px] top-[600px] w-[704px] font-sans font-normal leading-[1.5] text-[18px] text-[#2b231f]">
          Fieldnote is scent made the day you order it. Nothing sits on a shelf — every bottle is blended, fresh-filled, and labeled with your name by hand. Small batch, unhurried, and made to be yours from the first spray to the last.
        </p>
      </section>

      {/* Products 174:2267 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#f7f4f0] h-[980px] w-[768px] overflow-clip">
        <h2 className={`absolute left-[32px] top-[64px] ${MONO_EYEBROW}`}>House scents</h2>
        {PRODUCTS.map((p, i) => (
          <Card key={p.slug} p={p} x={i % 2 ? 396 : 32} y={i < 2 ? 104 : 526} w={340} imgW={315} imgH={302} />
        ))}
      </section>

      {/* Values 174:2302 */}
      <section className="[&_:is(p,h1,h2,span)]:translate-y-px relative bg-[#ece8e1] h-[374px] w-[768px] overflow-clip">
        {VALUES.map((v, i) => (
          <div key={v.label} className="absolute flex flex-col items-center w-[340px]" style={{ left: i % 2 ? 396 : 32, top: i < 2 ? 56 : 203 }}>
            <img alt="" loading="lazy" decoding="async" src={img(v.icon)} className="size-[44px]" />
            <p className="mt-[45px] font-serif font-normal leading-[1.3] text-[20px] text-[#2b231f] text-center whitespace-nowrap !translate-y-0">{v.label}</p>
          </div>
        ))}
      </section>
    </>
  );
}
