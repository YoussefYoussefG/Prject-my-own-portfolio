"use client";

import React from "react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./Animations";

const skillCategories = [
  {
    title: "Data Analytics",
    skills: ["Power BI", "SQL", "Excel", "Python"],
  },
  {
    title: "Front-End",
    skills: ["React", "Tailwind CSS", "Next.js", "TypeScript"],
  },
  {
    title: "Back-End",
    skills: ["Express.js", "FastAPI", "SQL", "MongoDB", "Django"],
  },
  {
    title: "Cross Platform",
    skills: ["React Native", "Flutter"],
  },
  {
    title: "Networking",
    skills: ["CCNA", "Linux", "Virtualization", "System Admin"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <FadeInUp className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-card/50 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground/70">
              Expertise
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif">
            Skills crafted with intent
          </h2>
        </FadeInUp>

        {/* Skills Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <StaggerItem key={index}>
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-foreground/5 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full">
                <h3 className="font-serif text-xl mb-6 text-foreground">{category.title}</h3>
                <ul className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-foreground/70 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/50"></div>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
