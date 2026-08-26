import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { WhatWeDo } from "@/components/WhatWeDo";
import { WhyHage } from "@/components/WhyHage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <WhatWeDo />
        <WhyHage />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
