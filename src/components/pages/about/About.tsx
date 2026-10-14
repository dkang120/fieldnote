/* About page, built from Figma frames 75:1766 (desktop 1440) and 103:2187 (phone 390).
   Positions are the frame's px values with the 101px header taken off the top. */
import Link from "next/link";
import { asset } from "@/lib/site";

const INK = "text-[#2b231f]";
const SERIF = `absolute font-serif font-normal whitespace-nowrap ${INK}`;
const LABEL = `absolute font-mono font-normal leading-[1.3] text-[12px] tracking-[1.6px] uppercase whitespace-nowrap ${INK}`;
const BTN = `absolute block border border-solid border-[#2b231f] overflow-clip transition-colors duration-200 hover:bg-[#2b231f] group`;
const BTN_TEXT = `absolute font-mono font-normal leading-[1.3] text-[12px] tracking-[1.6px] uppercase whitespace-nowrap ${INK} transition-colors duration-200 group-hover:text-[#f4f0e8]`;
const RULE = "absolute bg-[#2b231f] h-px left-0";

const P1 =
  "Fieldnote started with a simple frustration: cologne that sits in a warehouse for months before it ever reaches you, in a bottle that looks like everyone else's. I wanted something fresher, and something that actually felt like mine.";
const P2 =
  "So every bottle is mixed at our bench after you order, filled by hand, and labeled with your name, your city and the day it was made. Six house scents, made in small batches, for people who would rather smell like themselves.";

function Photo({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`absolute overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} src={asset(src)} loading="lazy" decoding="async" className="absolute inset-0 max-w-none object-cover size-full" />
    </div>
  );
}

const ALT = {
  hero: "Hands adding a drop from a pipette to a small bottle on a wooden workbench",
  band: "A campus lawn at dusk, one person walking across it",
  shell: "A Fieldnote bottle resting in a shell-shaped dish beside a handwritten card",
  wall: "A Fieldnote bottle and a candle on a wooden shelf against a paneled wall",
};

export function AboutDesktop() {
  return (
    <div className="bg-[#f7f4f0] h-[2703px] relative w-[1440px]">
      <h1 className="contents">
        <span className={`${SERIF} leading-[1.1] left-[493.95px] text-[48px] top-[46.4px]`}>MIXED BY HAND,</span>
        <span className={`${SERIF} leading-[1.1] left-[496.32px] text-[48px] top-[587.87px]`}>NAMED FOR YOU</span>
      </h1>
      <Photo src="/img/about/hero.webp" alt={ALT.hero} className="h-[370px] left-[572px] top-[163px] w-[296px]" />

      <div className={`${RULE} top-[699px] w-[1440px]`} />
      <Photo src="/img/about/band.webp" alt={ALT.band} className="h-[647px] left-0 top-[700px] w-[1440px]" />
      <div className={`${RULE} top-[1347px] w-[1440px]`} />

      <p className={`${LABEL} left-[92.85px] top-[1370.85px]`}>FILLED</p>
      <p className={`${LABEL} left-[711.52px] top-[1370.85px]`}>TO</p>
      <p className={`${LABEL} left-[1286.18px] top-[1370.85px]`}>ORDER</p>

      <h2 className={`${SERIF} -translate-x-1/2 leading-[1.1] left-[721.15px] text-[48px] text-center top-[1552.87px]`}>
        SCENT MADE<br />WITH INTENTION
      </h2>
      <p className={`absolute font-sans font-normal leading-[1.5] left-[548px] text-[18px] top-[1684.9px] whitespace-nowrap ${INK}`}>
        MIXED IN LOS ANGELES, CALIFORNIA
      </p>
      <p className={`absolute font-sans font-normal leading-[1.4] left-[374px] text-[12px] text-justify top-[1754.27px] w-[331px] ${INK}`}>{P1}</p>
      <p className={`absolute font-sans font-normal leading-[1.4] left-[735px] text-[12px] text-justify top-[1754.27px] w-[331px] ${INK}`}>{P2}</p>
      <Link href="/scents/" className={`${BTN} h-[50px] left-[587px] top-[1891.27px] w-[266px]`}>
        <span className={`${BTN_TEXT} left-[28px] top-[16px]`}>SHOP THE HOUSE SCENTS</span>
      </Link>

      <p className={`${LABEL} left-[103.51px] top-[2132.85px]`}>MADE</p>
      <p className={`${LABEL} left-[706.22px] top-[2132.85px]`}>FOR</p>
      <p className={`${LABEL} left-[1296.61px] top-[2132.85px]`}>YOU</p>

      <div className={`${RULE} top-[2162px] w-[1440px]`} />
      <Photo src="/img/about/shell.webp" alt={ALT.shell} className="h-[540px] left-0 top-[2163px] w-[718px]" />
      <Photo src="/img/about/wall.webp" alt={ALT.wall} className="h-[540px] left-[722px] top-[2163px] w-[718px]" />
    </div>
  );
}

export function AboutPhone() {
  return (
    <div className="bg-[#f7f4f0] h-[2186px] relative w-[390px]">
      <h1 className="contents">
        <span className={`${SERIF} leading-[1.25] left-[56px] text-[24px] top-[24px]`}>MIXED BY HAND,</span>
        <span className={`${SERIF} leading-[1.25] left-[58px] text-[24px] top-[440px]`}>NAMED FOR YOU</span>
      </h1>
      <Photo src="/img/about/hero.webp" alt={ALT.hero} className="h-[330px] left-[65px] top-[86px] w-[260px]" />

      <div className={`${RULE} top-[510px] w-[390px]`} />
      <Photo src="/img/about/band.webp" alt={ALT.band} className="h-[260px] left-0 top-[511px] w-[390px]" />
      <div className={`${RULE} top-[771px] w-[390px]`} />

      <p className={`${LABEL} left-[16px] top-[796px]`}>FILLED</p>
      <p className={`${LABEL} left-[186px] top-[796px]`}>TO</p>
      <p className={`${LABEL} left-[323px] top-[796px]`}>ORDER</p>

      <h2 className={`${SERIF} -translate-x-1/2 leading-[1.25] left-[195.5px] text-[24px] text-center top-[862px]`}>
        SCENT MADE<br />WITH INTENTION
      </h2>
      <p className={`absolute font-sans font-normal leading-[1.5] left-[69px] text-[14px] top-[946px] whitespace-nowrap ${INK}`}>
        MIXED IN LOS ANGELES, CALIFORNIA
      </p>
      <p className={`absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] text-justify top-[995px] w-[358px] ${INK}`}>{P1}</p>
      <p className={`absolute font-sans font-normal leading-[1.5] left-[16px] text-[14px] text-justify top-[1121px] w-[358px] ${INK}`}>{P2}</p>
      <Link href="/scents/" className={`${BTN} h-[48px] left-[16px] top-[1263px] w-[358px]`}>
        <span className={`${BTN_TEXT} left-[67.5px] top-[14px]`}>SHOP THE HOUSE SCENTS</span>
      </Link>

      <p className={`${LABEL} left-[16px] top-[1359px]`}>MADE</p>
      <p className={`${LABEL} left-[180px] top-[1359px]`}>FOR</p>
      <p className={`${LABEL} left-[344px] top-[1359px]`}>YOU</p>

      <div className={`${RULE} top-[1401px] w-[390px]`} />
      <Photo src="/img/about/shell.webp" alt={ALT.shell} className="left-0 size-[390px] top-[1402px]" />
      <Photo src="/img/about/wall.webp" alt={ALT.wall} className="left-0 size-[390px] top-[1796px]" />
    </div>
  );
}
