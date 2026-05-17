import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6 text-center border-t border-foreground/5">
      <p className="text-xs font-semibold tracking-widest text-foreground/40 uppercase">
        &copy; {currentYear} Youssef Gamal. All rights reserved.
      </p>
    </footer>
  );
}
