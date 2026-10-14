import { Frames } from "@/components/Frames";
import { HeaderDesktop, HeaderPhone, FooterDesktop, FooterPhone } from "@/components/site/Chrome";
import { NotFoundDesktop, NotFoundPhone } from "@/components/pages/home/NotFound";

export default function NotFound() {
  return (
    <Frames
      phone={<><HeaderPhone /><NotFoundPhone /><FooterPhone /></>}
      desktop={<><HeaderDesktop /><NotFoundDesktop /><FooterDesktop /></>}
    />
  );
}
