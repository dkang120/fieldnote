/**
 * Renders a bottle label as ZPL for a 203 dpi Zebra thermal printer (2" × 3" stock, 406 × 609 dots).
 * The bench scans an order, this payload goes to the printer (via PrintNode or a local agent),
 * and `preview` shows the technician exactly what will print.
 */
import { fmtLabelDate } from "../fill-dates";
import type { CartLine } from "../cart-types";
import type { LabelJob, LabelPrinter } from "./types";

/** ZPL treats ^ and ~ as commands; drop them and anything outside printable ASCII. */
export function zplSafe(s: string) {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[\^~\\]/g, "").replace(/[^\x20-\x7E]/g, "").toUpperCase();
}

export const zebraPrinter: LabelPrinter = {
  id: "zebra-zpl",
  render(line, { orderId, compounded, batch }): LabelJob | null {
    if (line.kind === "discovery") return null; // sample sets use a pre-printed card
    const title = line.kind === "custom" ? line.blendName || "Custom" : line.title;
    const no = line.kind === "custom" ? "CUSTOM" : `NO. ${line.no}`;
    const code = line.kind === "custom" ? line.formulaCode : line.sku;
    const p = line.personalization;
    const lines = [
      "FIELDNOTE",
      `${no}  ${zplSafe(title)}`,
      "MADE FOR",
      zplSafe(p.name || "—"),
      zplSafe(p.city || ""),
      `${fmtLabelDate(compounded)} · ${line.size} ML · EDP`,
      `BATCH ${batch} · ${code}`,
    ].filter(Boolean);

    const field = (y: number, h: number, text: string) =>
      `^FO0,${y}^FB406,1,0,C^A0N,${h},${h}^FD${zplSafe(text).replace("·", "-")}^FS`;
    const payload = [
      "^XA", "^CI28", "^PW406", "^LL609",
      field(40, 22, "FIELDNOTE"),
      field(100, 26, no),
      field(140, 40, title),
      "^FO123,200^GB160,2,2^FS",
      field(230, 22, "MADE FOR"),
      field(262, 34, p.name),
      field(310, 24, p.city),
      field(350, 22, `${fmtLabelDate(compounded)} - ${line.size} ML - EDP`),
      field(410, 18, `BATCH ${batch}`),
      field(436, 18, code),
      `^FO83,480^BY2^BCN,60,N,N,N^FD${zplSafe(orderId)}^FS`,
      "^XZ",
    ].join("\n");
    return { lineId: line.id, format: "zpl", payload, preview: lines };
  },
};
