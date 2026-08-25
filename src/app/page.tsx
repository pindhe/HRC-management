import { About } from "@/components/About";
import { Activities } from "@/components/Activities";
import { Community } from "@/components/Community";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowToJoin } from "@/components/HowToJoin";
import { Mission } from "@/components/Mission";
import { Navbar } from "@/components/Navbar";
import { ReadingCulture } from "@/components/ReadingCulture";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhyHage } from "@/components/WhyHage";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <WhatWeDo />
        <WhyHage />
        <Mission />
        <Activities />
        <ReadingCulture />
        <Community />
        <HowToJoin />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
