"use client";

import React from "react";
import { FadeInUp } from "./Animations";
import Terminal from "./Terminal";

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
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-16 max-w-4xl leading-tight">
            Bridging Software Development, Data Analytics & Business Development
          </h2>
        </FadeInUp>

        {/* Content Section: Text and Terminal */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Text Card */}
          <FadeInUp delay={0.2} className="h-full">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-foreground/5 h-full flex flex-col justify-center">
              <div className="space-y-6 text-foreground/80 leading-relaxed md:text-lg">
                <p>
                  I am a passionate software engineer and data analyst with a drive for building scalable applications and deriving actionable insights from complex datasets.
                </p>
                <p>
                  By combining a strong foundation in frontend and backend development with advanced data analytics capabilities, I approach problems holistically. Whether it&apos;s architecting a robust API, designing an intuitive user interface, or visualizing key business metrics.
                </p>
                <p>
                  Beyond the code, I am deeply interested in business development and how technology can be leveraged to drive growth and efficiency.
                </p>
              </div>
            </div>
          </FadeInUp>

          {/* Interactive Terminal */}
          <FadeInUp delay={0.3} className="h-full mt-4 lg:mt-0">
            <Terminal />
          </FadeInUp>
        </div>

      </div>
    </section>
  );
}
