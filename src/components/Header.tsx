"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "ABOUT", href: "#about", desc: "My journey & background" },
  { name: "SKILLS", href: "#skills", desc: "Technologies I master" },
  { name: "EXPERIENCE", href: "#experience", desc: "My career history" },
  { name: "WORK", href: "#work", desc: "Featured projects" },
  { name: "CONTACT", href: "#contact", desc: "Let's build something" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Spacer (for centering logo) */}
        <div className="hidden md:block flex-1"></div>

        {/* Logo */}
        <div className="flex-1 flex justify-start md:justify-center">
          <Link
            href="#"
            className="font-serif text-2xl font-bold tracking-tighter"
          >
            <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background text-lg">
              YG
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-end items-center gap-8 text-xs font-semibold tracking-widest text-foreground/70">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className="hover:text-accent transition-colors duration-200"
              >
                {link.name}
              </Link>
              {/* Custom Tooltip */}
              <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-foreground text-background text-[10px] tracking-normal whitespace-nowrap rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none shadow-xl">
                {link.desc}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"></div>
              </div>
            </div>
          ))}
          <div className="pl-4 border-l border-foreground/10">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Toggle & Theme */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-foreground/10 shadow-md">
          <nav className="flex flex-col items-center py-6 gap-6 text-sm font-semibold tracking-widest text-foreground/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-accent transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
