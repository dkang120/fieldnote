import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";

export default function Home() {
  return (
    <Frames
      phone={<><HeaderPhone /><Newsletter device="p" /><FooterPhone /></>}
      tablet={<><HeaderPhone width={768} /><Newsletter device="t" /><FooterPhone width={768} /></>}
      desktop={<><HeaderDesktop /><Newsletter device="d" /><FooterDesktop /></>}
    />
  );
}
