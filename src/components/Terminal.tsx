"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function Terminal() {
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: (
        <div className="text-foreground/80">
          Welcome to YoussefOS v1.0.0
          <br />
          Type <span className="text-accent font-semibold">&apos;help&apos;</span> to see available commands.
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = "";

    switch (trimmedCmd) {
      case "help":
        output = (
          <div className="space-y-1 mt-2 mb-2">
            <div><span className="text-accent w-20 inline-block font-semibold">whoami</span> - Display my bio</div>
            <div><span className="text-accent w-20 inline-block font-semibold">skills</span> - List my technical skills</div>
            <div><span className="text-accent w-20 inline-block font-semibold">contact</span> - Get my contact info</div>
            <div><span className="text-accent w-20 inline-block font-semibold">clear</span> - Clear the terminal window</div>
          </div>
        );
        break;
      case "whoami":
        output = (
          <div className="mt-2 mb-2 text-foreground/80">
            I am Youssef, a passionate software developer and data analyst bridging the 
            gap between robust engineering and business intelligence. 
            I build scalable web apps and turn complex data into actionable insights.
          </div>
        );
        break;
      case "skills":
        output = (
          <div className="mt-2 mb-2">
            <ul className="list-disc list-inside ml-4 text-foreground/80 space-y-1">
              <li><span className="font-medium text-foreground">Frontend:</span> React, Next.js, TypeScript, Tailwind CSS, Framer Motion</li>
              <li><span className="font-medium text-foreground">Backend & DB:</span> Node.js, Python, Supabase, SQL</li>
              <li><span className="font-medium text-foreground">Data Analytics:</span> PowerBI, Pandas, NumPy</li>
            </ul>
          </div>
        );
        break;
      case "contact":
        output = (
          <div className="mt-2 mb-2 text-foreground/80">
            Reach out through the contact form below or feel free to email me directly. Let&apos;s build something great!
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "":
        output = "";
        break;
      default:
        output = <div className="text-red-400 mt-2 mb-2">Command not found: {cmd}. Type &apos;help&apos; for available commands.</div>;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="w-full h-[350px] bg-[#0d1117] rounded-xl border border-foreground/10 shadow-2xl overflow-hidden flex flex-col font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-[#161b22] px-4 py-3 border-b border-foreground/5 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex-1 flex justify-center text-foreground/50 text-xs flex items-center gap-2">
          <TerminalIcon size={14} /> guest@youssef-portfolio ~
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 flex-1 overflow-y-auto text-green-400/90 custom-scrollbar">
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command && (
              <div className="flex gap-2 text-foreground/70">
                <span className="text-pink-500">➜</span>
                <span className="text-cyan-400">~</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex gap-2 text-foreground/70 items-center">
          <span className="text-pink-500">➜</span>
          <span className="text-cyan-400">~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-foreground shadow-none ring-0 p-0"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}