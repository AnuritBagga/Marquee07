import SmoothScroll from "@/components/landing/SmoothScroll";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import LiveDemo from "@/components/landing/LiveDemo";
import ThreeModes from "@/components/landing/ThreeModes";
import Domains from "@/components/landing/Domains";
import Testimonial from "@/components/landing/Testimonial";
import CTAFooter from "@/components/landing/CTAFooter";

export default function Landing() {
  return (
    <SmoothScroll>
      <main data-testid="landing-page" className="relative bg-[#050505] text-white">
        <Nav />
        <Hero />
        <LiveDemo />
        <ThreeModes />
        <Domains />
        <Testimonial />
        <CTAFooter />
      </main>
    </SmoothScroll>
  );
}
