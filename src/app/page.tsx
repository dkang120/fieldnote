import { Frames } from "@/components/Frames";
import { HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { Newsletter } from "@/components/site/Newsletter";
import { HomeDesktop, HomePhone, HomeTablet } from "@/components/pages/home/Home";

export default function Home() {
  return (
    <Frames
      phone={<><HeaderPhone /><HomePhone /><Newsletter device="p" /><FooterPhone /></>}
      tablet={<><HeaderPhone width={768} /><HomeTablet /><Newsletter device="t" /><FooterPhone width={768} /></>}
      desktop={<><HomeDesktop /><Newsletter device="d" /><FooterDesktop /></>}
    />
  );
}
