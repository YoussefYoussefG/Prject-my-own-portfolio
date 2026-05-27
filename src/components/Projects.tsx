"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./Animations";
import { getProjectsByCategory, ProjectCategory } from "../lib/services/projectService";

// Static fallback data in case Supabase is unreachable
const fallbackData: ProjectCategory[] = [
  {
    id: "fallback-web",
    category: "Web Apps",
    count: 3,
    projects: [
      { id: "1", title: "Pediatric Pulse | Healthcare Platform", description: "A full clinic management system with web and mobile applications.", tags: ["WEB APP", "MOBILE"], link_text: "GITHUB REPO", link_url: "#" },
      { id: "2", title: "Image Processing Application", description: "An interactive web app for mixing visual components and corner detection.", tags: ["WEB APP"], link_text: "GITHUB REPO", link_url: "#" },
      { id: "3", title: "BM - Backend Service", description: "A modular backend service with secure API endpoints and authentication.", tags: ["WEB APP"], link_text: "GITHUB REPO", link_url: "#" },
    ],
  },
  {
    id: "fallback-mobile",
    category: "Mobile Apps",
    count: 3,
    projects: [
      { id: "4", title: "Pediatric Pulse | Healthcare Platform", description: "A full clinic management system with web and mobile applications.", tags: ["WEB APP", "MOBILE"], link_text: "GITHUB REPO", link_url: "#" },
      { id: "5", title: "QR Authentication System", description: "A secure login system utilizing UUID-based QR code generation.", tags: ["MOBILE"], link_text: "GITHUB REPO", link_url: "#" },
      { id: "6", title: "EchoPlay", description: "A cross-platform mobile game with a modern Truth or Dare experience.", tags: ["MOBILE"], link_text: "GITHUB REPO", link_url: "#" },
    ],
  },
  {
    id: "fallback-data",
    category: "Data Analytics",
    count: 3,
    projects: [
      { id: "7", title: "HR Dashboard", description: "An interactive HR dashboard in Power BI for workforce data analysis.", tags: ["DATA"], link_text: "VIEW ANALYTICS", link_url: "#" },
      { id: "8", title: "E-Commerce Sales Dashboard", description: "An interactive sales dashboard analyzing key e-commerce metrics.", tags: ["DATA"], link_text: "VIEW ANALYTICS", link_url: "#" },
      { id: "9", title: "ISP-Dashboard", description: "An ISP Power BI dashboard for customer segmentation and revenue optimization.", tags: ["DATA"], link_text: "VIEW ANALYTICS", link_url: "#" },
    ],
  },
];

export default function Projects() {
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjectsByCategory();
      let displayData = data.length > 0 ? data : fallbackData;

      // Unconditionally inject the Portfolio project and update BM Backend Service & Image Processing
      displayData = displayData.map(category => {
        let updatedProjects = [...category.projects];
        
        // Update specific projects if they exist
        updatedProjects = updatedProjects.map(p => {
          if (p.title === "BM - Backend Service" || p.title.includes("BM")) {
            return {
              ...p,
              title: "BM - Business Management API",
              description: "A secure, Next-Level Node.js backend using Clean Architecture, Prisma ORM, and enterprise Zod validation.",
              tags: ["NODE.JS", "TYPESCRIPT", "PRISMA"],
              link_url: "https://github.com/YoussefYoussefG/next-level-bm"
            };
          }
          if (p.title === "Image Processing Application" || p.title.includes("Image Processing")) {
            return {
              ...p,
              title: "Medical Image Processing Platform",
              description: "A comprehensive computer vision desktop application featuring a custom GUI for analyzing medical DICOM datasets and standard images.",
              tags: ["PYTHON", "OPENCV", "DESKTOP"],
              link_url: "https://github.com/YoussefYoussefG/Image-Processing-Platform" // Placeholder, update if different
            };
          }
          return p;
        });

        if (category.category === "Web Apps") {
          const hasPortfolio = updatedProjects.some(p => p.title === "Developer Portfolio");
          if (!hasPortfolio) {
            updatedProjects = [
              {
                id: "portfolio-self",
                title: "Developer Portfolio",
                description: "A modern, professional portfolio built with Next.js, Tailwind v4, Framer Motion, and automated CI/CD testing.",
                tags: ["WEB APP", "NEXT.JS"],
                link_text: "GITHUB REPO",
                link_url: "https://github.com/YoussefYoussefG/Prject-my-own-portfolio"
              },
              ...updatedProjects,
            ];
          }
          return {
            ...category,
            count: updatedProjects.length,
            projects: updatedProjects
          };
        }
        
        return {
          ...category,
          projects: updatedProjects
        };
      });

      setProjectCategories(displayData);
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
                    <div className="bg-card rounded-3xl p-8 shadow-sm border border-foreground/5 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
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

