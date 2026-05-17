"use client";

import React from "react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./Animations";

const experiences = [
  {
    company: "Silu",
    role: "Business Development",
    date: "DEC 2023 - CURRENT",
    description: [
      "Handled professional communication with clients, including drafting emails, meeting follow-ups, and coordinating documentation such as NDAs.",
      "Assisted in organizing tasks, tracking progress, and aligning deliverables with business goals.",
      "Engaged in networking activities and contributed to strengthening the company's presence and partnerships."
    ],
    logoText: "Si",
    logoBg: "bg-amber-100 text-amber-800"
  },
  {
    company: "ECG",
    role: "Medical Equipment Planning | Intern",
    date: "AUG 2023 - SEP 2023",
    description: [
      "Supported digital transformation initiatives and technical infrastructure documentation for healthcare facilities."
    ],
    logoText: "ECG",
    logoBg: "bg-teal-100 text-teal-800"
  },
  {
    company: "LDS",
    role: "Backend Development | Intern",
    date: "SEP 2024 - OCT 2024",
    description: [
      "Engineered backend services for a Laboratory Management System using Node.js and Express.js.",
      "Implemented secure REST API endpoints and integrated MongoDB for efficient data persistence.",
      "Optimized database queries, improving system response time for laboratory record retrieval."
    ],
    logoText: "LDS",
    logoBg: "bg-indigo-100 text-indigo-800"
  },
  {
    company: "WE Data",
    role: "Mobile Development | Intern",
    date: "JUL 2023 - SEP 2023",
    description: [
      "Developed features for high-traffic mobile utility applications serving thousands of users.",
      "Integrated backend components with complex backend APIs using Kotlin.",
      "Collaborated with UX/UI designers to implement responsive and intuitive mobile interfaces."
    ],
    logoText: "WE",
    logoBg: "bg-violet-100 text-violet-800"
  },
  {
    company: "Xceed",
    role: "System Admin & IT Support | Intern",
    date: "JUL 2022 - SEP 2022",
    description: [
      "Configured Windows Server environments and managed Active Directory for enterprise users.",
      "Maintained HP server hardware and provided critical technical troubleshooting for internal systems."
    ],
    logoText: "X",
    logoBg: "bg-rose-100 text-rose-800"
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header Area */}
        <FadeInUp className="mb-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-card mb-8">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-foreground/70">
              Experience
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif">
            Where I Drove Impact
          </h2>
        </FadeInUp>

        {/* Experience Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {experiences.map((exp, index) => (
            <StaggerItem key={index}>
              <div className="bg-card rounded-3xl p-8 md:p-10 shadow-sm border border-foreground/5 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 text-xs font-bold tracking-wider ${exp.logoBg}`}>
                  {exp.logoText}
                </div>
                
                <h3 className="text-xl font-serif mb-1">{exp.company}</h3>
                <div className="flex flex-col gap-1 mb-6">
                  <span className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">{exp.role}</span>
                  <span className="text-xs text-foreground/40 uppercase tracking-widest">{exp.date}</span>
                </div>
                
                <ul className="space-y-3 mt-auto">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="text-sm text-foreground/70 leading-relaxed pl-4 relative">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                      {item}
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
