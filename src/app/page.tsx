"use client";

import { useChat, Chat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";

const chat = new Chat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
});

const PRESETS = [
  "A landing page for a coffee shop with hero, menu, and contact",
  "A portfolio site for a photographer with gallery grid",
  "A SaaS pricing page with 3 tiers",
  "A restaurant homepage with hero image and reservation form",
];

export default function Home() {
  const { messages, sendMessage, status, error } = useChat({ chat });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePreset = (preset: string) => {
    setInput("");
    sendMessage({ text: preset });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-semibold text-lg">Astro Builder</h1>
            <p className="text-xs text-muted">Powered by MiMo V2.5 Pro</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
                A
              </div>
              <h2 className="text-2xl font-semibold mb-2">What do you want to build?</h2>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Describe a website and I&apos;ll generate Astro code with WebcoreUI components.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className="text-left p-3 rounded-lg border border-border hover:border-accent hover:bg-surface transition-all text-sm"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surface border border-border"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none">
                    {msg.content.split(/(```[\s\S]*?```)/).map((part, i) => {
                      if (part.startsWith("```")) {
                        const lines = part.split("\n");
                        const lang = lines[0].replace("```", "").trim();
                        const code = lines.slice(1, -1).join("\n");
                        return (
                          <div key={i} className="my-3 relative group">
                            {lang && (
                              <div className="absolute top-2 right-2 text-xs text-muted bg-background/50 px-2 py-0.5 rounded">
                                {lang}
                              </div>
                            )}
                            <pre>
                              <code>{code}</code>
                            </pre>
                          </div>
                        );
                      }
                      return (
                        <span key={i} className="whitespace-pre-wrap">
                          {part}
                        </span>
                      );
                    })}
                    {isLoading && <span className="streaming-cursor" />}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center text-red-400 text-sm py-4">
              Error: {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your website..."
              rows={1}
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Building...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
