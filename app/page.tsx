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
import { FeaturedTitleProvider } from "@/components/FeaturedTitleContext";

export default function Home() {
  return (
    <FeaturedTitleProvider>
      <main className="bg-void text-ink">
        <Navbar />
        {/* Hero and TrailerShowcase share FeaturedTitleContext — selecting a
            trailer here swaps the backdrop video in the hero and vice-versa. */}
        <Hero />
        <GameTrailers />
        <HowItWorks />
        <GameLibrary />
        <DeviceCompat />
        <Performance />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
    </FeaturedTitleProvider>
  );
}
