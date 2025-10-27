"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Introduction() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleEnter = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name.trim());
    router.push("/world");
  };

  return (
    <main className="min-h-screen bg-[black] text-[var(--text)] flex flex-col items-center justify-center p-6">
      
      {/* Fade-in container */}
      <div className="text-center max-w-2xl space-y-8 animate-fadeInSlow">

        <p className="text-lg opacity-80 leading-relaxed">
          Before memory. Before myth.  
          There was only the Fifth Layer.
        </p>

        <h1 className="text-4xl font-serif tracking-wide text-[var(--accent)]">
          You have crossed into the Unwritten.
        </h1>

        <p className="text-lg opacity-80 leading-relaxed">
          Speak your name, <span className="text-[var(--accent)]">Seeker</span>,  
          that the world may know your arrival.
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="w-full max-w-md px-4 py-3 rounded-lg bg-black/40 border border-[var(--accent)]/40 text-center outline-none focus:border-[var(--accent)] transition"
        />

        <button
          onClick={handleEnter}
          className="mt-4 px-6 py-3 text-black font-medium bg-[var(--accent)] rounded-lg shadow-[0_0_20px_rgba(155,135,245,0.5)] hover:shadow-[0_0_30px_rgba(155,135,245,0.8)] transition"
        >
          Enter the Fifth Layer
        </button>

      </div>

    </main>
  );
}
