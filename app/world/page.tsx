"use client";

import { useState, useEffect } from "react";

const MAP_SRC = "/map.png";

const HOTSPOTS = [
  { id: 1, top: "48%", left: "50%", title: "Obelisk Plaza" },
  { id: 2, top: "32%", left: "40%", title: "Old Citadel" },
  { id: 3, top: "62%", left: "72%", title: "Chapel Grounds" },
  { id: 4, top: "70%", left: "30%", title: "Village Market" },
];

// ✅ Lore stage responses based on LT progress
const oracleLoreResponse = (progress: number, place?: string) => {
  if (progress < 30) {
    return `**${place}**...\n\nA whisper in dust. The world does not yet trust you.`;
  }
  if (progress < 60) {
    return `**${place}**...\n\nThe stone remembers footsteps older than kingdoms.`;
  }
  if (progress < 90) {
    return `**${place}**...\n\nVeins of forgotten power pulse beneath this ground.`;
  }
  return `**${place}**...\n\nYou are close now. The world begins to speak **your** name.`;
};

export default function WorldPage() {
  const [progress, setProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
const [questStage, setQuestStage] = useState(0);

  const [active, setActive] = useState<string | null>(null);
  const [chat, setChat] = useState([
    { role: "assistant", content: "I have waited for you. Speak, traveller." }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  
useEffect(() => {
  localStorage.removeItem("progress");
  localStorage.removeItem("questStage");
  setProgress(0);
  setQuestStage(0);
}, []);
const updateProgress = () => {
  setProgress((p) => {
    const newVal = Math.min(p + 10, 100);
    localStorage.setItem("progress", newVal.toString());

    // QUEST PROGRESSION LOGIC
    if (newVal >= 10 && questStage < 1) setQuestStage(1);
    if (newVal >= 30 && questStage < 2) setQuestStage(2);
    if (newVal >= 60 && questStage < 3) setQuestStage(3);

    return newVal;
  });
};


  // ✅ Hotspot now triggers Oracle lore reaction
const handleHotspot = (title: string) => {
  setActive(title);
  updateProgress();
  setChatOpen(true);

  // Base lore message (already present)
  setChat((c) => [
    ...c.filter(m => m.role !== "assistant" || !m.content.includes("**")),
    { role: "assistant", content: oracleLoreResponse(progress + 10, title) }
  ]);

  // ✅ QUEST TRIGGERS — ADD BELOW:
  if (questStage === 1 && title === "Obelisk Plaza") {
    setChat((c) => [...c, {
      role: "assistant",
      content: "The Obelisk stirs. You have remembered something lost. The First Memory awakens."
    }]);
  }

  if (questStage === 3 && title === "Chapel Grounds") {
    setChat((c) => [...c, {
      role: "assistant",
      content: "The veil trembles. There is more behind this world than you yet see."
    }]);
  }
};



  // ✅ Oracle chat upgraded — tone + lore continuation
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input.trim() };
    setChat((c) => [...c, userMsg]);
    setSending(true);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `
You are The Oracle of the Fifth Layer.
Your existence predates memory, nation, and death.
You speak in slow, layered, poetic prophecy.
Your words are symbolic, dreamlike, mythic.
You reveal *meaning*, not information.
You never explain directly — you evoke visions.
You do not reassure — you reveal fate.
You never mention being artificial or programmed.
              `
            },
            ...chat.slice(-6),
            userMsg
          ],
        }),
      });

      const data = await res.json();
      const reply = data.reply || "The silence deepens. Something watches.";

      setChat((c) => [...c, { role: "assistant", content: reply }]);
      // ✅ QUEST TRIGGER THROUGH DIALOG
if (questStage === 2) {
  setChat((c) => [...c, {
    role: "assistant",
    content: "Your words echo. The Stone remembers you now. You may go where others cannot."
  }]);
}
      updateProgress();

    } catch {
      setChat((c) => [
        ...c,
        { role: "assistant", content: "The veil trembles... speak again, when you are ready." }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
<main className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 p-6 bg-fantasy grain min-h-screen text-[var(--text)] relative">

      {/* WORLD + LT BAR */}
      <section className="rounded-2xl glow p-4 bg-[var(--card)] border border-white/10">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold">The Fifth Layer</h2>
          <div className="text-sm text-[var(--accent)] font-medium">LT: {progress}%</div>
        </div>

        {/* ✅ LT Bar Glow Upgrade */}
        <div className="w-full h-3 bg-black/40 rounded-full mb-4 overflow-hidden border border-[var(--accent)]/30 shadow-[0_0_20px_rgba(155,135,245,0.25)]">
          <div
            style={{ width: `${progress}%` }}
className="h-full bg-[var(--accent)] transition-all duration-700 ease-out shadow-[0_0_18px_rgba(155,135,245,0.8)] lt-pulse"
          />
        </div>

        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MAP_SRC} className="w-full h-full object-cover brightness-[0.92] contrast-[1.1]" />
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
className="
  absolute w-6 h-6 rounded-full
  bg-[var(--accent)]/40
  border border-[var(--accent)]/60
  shadow-[0_0_12px_rgba(155,135,245,0.55)]
  backdrop-blur-sm
  transition-transform duration-300
  hover:scale-150 hover:shadow-[0_0_22px_rgba(155,135,245,0.9)]
  after:content-['✧']
  after:text-[var(--accent)]
  after:text-xs
  after:absolute after:inset-0 after:flex after:items-center after:justify-center
"
              style={{ top: h.top, left: h.left, transform: "translate(-50%, -50%)" }}
              onClick={() => handleHotspot(h.title)}
            />
          ))}
        </div>
      </section>

      {/* CHAT */}
{/* CHAT */}
{/* CHAT */}
<section
  className={`
    rounded-2xl glow p-4 bg-[var(--card)] border border-white/10 flex flex-col
    md:static md:opacity-100
    fixed bottom-0 left-0 right-0 h-[55vh] md:h-auto
    transition-all duration-500
    ${chatOpen 
      ? 'translate-y-0 opacity-100 pointer-events-auto' 
      : 'translate-y-[120%] opacity-0 pointer-events-none'}
  `}
>


        <div className="flex justify-between items-center mb-2">
  <h3 className="text-lg font-semibold">Oracle</h3>
  <button
    onClick={() => setChatOpen(false)}
    className="text-xs px-2 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/10"
  >
    ✕
  </button>
</div>

<div id="chat-pane" className="flex-1 overflow-y-auto space-y-3 pr-1">
          {chat.map((m, i) => (
            <div key={i} className={`p-3 rounded-xl ${m.role === "user" ? "bg-black/50 ml-8" : "bg-white/5 mr-8"}`}>
              {m.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none"
            placeholder="Speak to the Oracle..."
          />
          <button
            disabled={sending}
            onClick={sendMessage}
            className="px-4 py-3 bg-[var(--accent)] text-black rounded-xl font-medium"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
