"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Download, Eye, X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isResumeOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isResumeOpen]);

  useEffect(() => {
    if (!isResumeOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsResumeOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResumeOpen]);

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-center max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm tracking-widest uppercase font-semibold text-foreground/60"
            >
              Software Engineer & Data Analyst
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-7xl md:text-8xl lg:text-9xl font-serif leading-[0.9] text-foreground flex flex-col mt-2 group cursor-default"
            >
              {/* First Name Crossfade */}
              <div className="relative w-max">
                <span className="font-normal tracking-tight transition-opacity duration-500 group-hover:opacity-0">Youssef</span>
                <span className="absolute left-0 top-0 font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">Youssef</span>
              </div>
              
              {/* Last Name Crossfade */}
              <div className="relative w-max ml-8 md:ml-16">
                <span className="italic text-foreground/80 font-medium transition-opacity duration-500 delay-75 group-hover:opacity-0">Gamal</span>
                <span className="absolute left-0 top-0 italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 opacity-0 transition-opacity duration-500 delay-75 group-hover:opacity-100 pointer-events-none">Gamal</span>
              </div>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
          >
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="group flex items-center gap-4 bg-foreground text-background px-8 py-4 rounded-full font-semibold text-xs tracking-widest hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg"
              >
                ENTER PORTFOLIO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="group flex items-center gap-3 bg-transparent border border-foreground/20 text-foreground px-6 py-4 rounded-full font-semibold text-xs tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
                aria-haspopup="dialog"
                aria-expanded={isResumeOpen}
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                VIEW CV
              </button>
              <a
                href="/resume.pdf"
                download
                className="group flex items-center gap-3 bg-transparent border border-foreground/20 text-foreground px-6 py-4 rounded-full font-semibold text-xs tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                DOWNLOAD CV
              </a>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold tracking-widest text-foreground/50">
              <div className="w-12 h-[1px] bg-foreground/20"></div>
              BASED IN CAIRO
            </div>
          </motion.div>
        </div>

        {/* Right Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto"
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 -right-4 w-full h-full border border-foreground/10 rounded-2xl"></div>
          <div className="absolute -bottom-4 right-4 w-full h-full bg-accent/5 rounded-2xl"></div>
          
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center p-2">
            <div className="w-full h-full relative rounded-xl overflow-hidden bg-[#e5e5e5]">
              <Image 
                src="/profile.jpg" 
                alt="Youssef Portrait"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>

      {isResumeOpen && (
        <div
          className="fixed inset-0 z-[80] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsResumeOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Resume preview"
            className="bg-background w-full max-w-5xl h-[80vh] rounded-2xl shadow-xl border border-foreground/10 overflow-hidden flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-foreground/50">
                  Resume
                </p>
                <h3 className="text-lg font-serif">Youssef Gamal CV</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD
                </a>
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(false)}
                  className="p-2 rounded-full hover:bg-foreground/5 text-foreground transition-colors"
                  aria-label="Close resume preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-foreground/5">
              <object data="/resume.pdf" type="application/pdf" className="w-full h-full">
                <div className="h-full w-full flex items-center justify-center p-8 text-sm text-foreground/60">
                  <p>
                    Preview not available. Use the download button above to view the CV.
                  </p>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
