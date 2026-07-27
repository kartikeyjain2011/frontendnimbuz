import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import GameLibrary from "@/components/GameLibrary";
import GameTrailers from "@/components/GameTrailers";
import DeviceCompat from "@/components/DeviceCompat";
import Performance from "@/components/Performance";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-void text-ink">
      <Navbar />
      <Hero />
      <HowItWorks />
      <GameLibrary />
      <GameTrailers />
      <DeviceCompat />
      <Performance />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
