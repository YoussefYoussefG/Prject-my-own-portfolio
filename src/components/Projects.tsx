"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./Animations";
import { getProjectsByCategory, ProjectCategory } from "../lib/services/projectService";

export default function Projects() {
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjectsByCategory();
      setProjectCategories(data);
      setLoading(false);
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <section id="work" className="py-32 px-6 md:px-12 flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="work" className="py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        <FadeInUp>
          <h2 className="text-4xl md:text-5xl font-serif mb-20 text-center max-w-2xl mx-auto leading-tight">
            Recent projects and experiments
          </h2>
        </FadeInUp>

        <div className="space-y-24">
          {projectCategories.map((section, index) => (
            <div key={section.id || index}>
              <FadeInUp>
                <div className="flex items-center justify-between mb-8 border-b border-foreground/10 pb-4">
                  <h3 className="text-2xl font-serif flex items-center gap-3">
                    {section.category}
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </h3>
                  <span className="text-xs font-semibold tracking-widest text-foreground/40">
                    {section.count} TOTAL
                  </span>
                </div>
              </FadeInUp>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.projects.map((project, idx) => (
                  <StaggerItem key={project.id || idx}>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-foreground/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {project.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-semibold tracking-widest text-foreground/50 uppercase bg-foreground/5 px-2.5 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="text-lg font-serif mb-4">{project.title}</h4>
                      <p className="text-sm text-foreground/70 leading-relaxed mb-8 flex-grow">
                        {project.description}
                      </p>
                      
                      <a 
                        href={project.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-foreground/60 hover:text-accent transition-colors mt-auto group"
                      >
                        {project.link_text}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
