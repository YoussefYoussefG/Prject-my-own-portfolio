"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
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
            <a
              href="#work"
              className="group flex items-center gap-4 bg-foreground text-background px-8 py-4 rounded-full font-semibold text-xs tracking-widest hover:bg-foreground/90 transition-all duration-300 hover:shadow-lg"
            >
              ENTER PORTFOLIO
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
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
    </section>
  );
}
