"use client";

import React from "react";
import { FadeInUp } from "./Animations";

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Indicator */}
        <FadeInUp>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-card/50 mb-12">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground/70">
              About
            </span>
          </div>
        </FadeInUp>

        {/* Heading */}
        <FadeInUp delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 max-w-3xl leading-tight">
            Bridging Software Development, Data Analytics & Business Development
          </h2>
        </FadeInUp>

        {/* Text Card */}
        <FadeInUp delay={0.2}>
          <div className="bg-card rounded-3xl p-8 md:p-16 shadow-sm border border-foreground/5 w-full">
            <div className="space-y-8 text-foreground/80 leading-relaxed md:text-lg">
              <p>
                I am a passionate software engineer and data analyst with a drive for building scalable applications and deriving actionable insights from complex datasets. My journey in technology has been defined by a constant pursuit of learning and a commitment to creating impactful solutions.
              </p>
              <p>
                By combining a strong foundation in frontend and backend development with advanced data analytics capabilities, I approach problems holistically. Whether it&apos;s architecting a robust API, designing an intuitive user interface, or visualizing key business metrics, I strive for excellence in every layer of the stack.
              </p>
              <p>
                Beyond the code, I am deeply interested in business development and how technology can be leveraged to drive growth and efficiency. I believe that the best solutions are not just technically sound, but also align perfectly with business objectives and user needs.
              </p>
            </div>
          </div>
        </FadeInUp>

      </div>
    </section>
  );
}
