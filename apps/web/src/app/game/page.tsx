"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PitchDetector } from "@/components/audio/PitchDetector";
import { NoteHighway } from "@/components/game/NoteHighway";
import { GameHUD } from "../../components/game/GameHUD";
import { useSafeGameStore } from "@/hooks/useClientGameStore";

export default function GamePage() {
  const { updatePitch, isPlaying } = useSafeGameStore();

  const handlePitchChange = (frequency: number, confidence: number) => {
    // Only update pitch if confidence is high enough and game is playing
    if (confidence > 0.7 && isPlaying) {
      updatePitch(frequency);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/25">
              🎵
            </div>
            <h1 className="text-5xl font-black tracking-tight">
              <span className="text-white">Vocal</span>
              <span className="gradient-text">Vibe</span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Transform your voice into a musical journey. Match falling notes
            with perfect pitch and rhythm.
          </p>
        </motion.header>

        {/* Main Game Layout */}
        <div className="grid gap-8 xl:grid-cols-12 lg:grid-cols-8">
          {/* Left Sidebar - Game HUD */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="xl:col-span-3 lg:col-span-3"
          >
            <div className="sticky top-8">
              <GameHUD />
            </div>
          </motion.aside>

          {/* Center Stage - Note Highway */}
          <motion.main
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="xl:col-span-6 lg:col-span-5 flex flex-col items-center"
          >
            <div className="glass-strong rounded-3xl p-8 shadow-2xl">
              <NoteHighway width={420} height={640} />
            </div>
          </motion.main>

          {/* Right Sidebar - Controls & Stats */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="xl:col-span-3 lg:col-span-3 space-y-6"
          >
            {/* Pitch Monitor */}
            <div className="glass-strong rounded-2xl p-6 card-shadow smooth-transition hover:card-shadow-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-lg">🎤</span>
                </div>
                <h3 className="text-white font-semibold text-lg">
                  Voice Monitor
                </h3>
              </div>
              <PitchDetector
                onPitchChange={handlePitchChange}
                className="h-fit"
              />
            </div>

            {/* Live Performance Stats */}
            <div className="glass rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h3 className="text-white font-semibold text-lg">Live Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/5">
                  <span className="text-slate-300 font-medium">Status</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400" : "bg-slate-400"} animate-pulse`}
                    />
                    <span
                      className={`font-semibold ${isPlaying ? "text-green-400" : "text-slate-400"}`}
                    >
                      {isPlaying ? "Live" : "Standby"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guide */}
            <div className="glass rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <h3 className="text-white font-semibold text-lg">
                  Quick Guide
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: "▶️", text: "Press Start to begin your session" },
                  { icon: "🎤", text: "Allow microphone access" },
                  { icon: "🎵", text: "Match notes as they fall" },
                  { icon: "🔥", text: "Chain hits for combo bonuses" },
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <span className="text-lg">{step.icon}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-6 inline-block">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs">🎵</span>
              </div>
              <span className="font-medium">VocalVibe</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm">Powered by Web Audio API</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
