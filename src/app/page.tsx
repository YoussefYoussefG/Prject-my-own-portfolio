"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="flex flex-col min-h-screen">
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      {!showSplash && (
        <>
          <Header />
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
          <Footer />
        </>
      )}
    </main>
  );
}
