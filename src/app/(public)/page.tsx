import Hero from "@features/home/component/Hero";
import WhyUs from "@features/home/component/WhyUs";
import ActiveProjects from "@features/home/component/ActiveProjects";
import PartnersAndMedia from "@features/home/component/PartnersAndMedia";
import FaQ from "@features/home/component/FaQ";
import Disclaimer from "@features/home/component/Disclaimer";
import { 
  HelpButton,
  HelpButtonPosition,
} from "@features/home/component/HelpButton";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyUs />
      <ActiveProjects />
      <PartnersAndMedia />
      <FaQ /> 
      <Disclaimer />
      <HelpButtonPosition>
        <HelpButton />
      </HelpButtonPosition>
    </>
  );
}
