"use client";

import { PitchDetector } from "@/components/audio/PitchDetector";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/25">
              🎵
            </div>
            <h1 className="text-7xl font-black tracking-tight">
              <span className="text-white">Vocal</span>
              <span className="gradient-text">Vibe</span>
            </h1>
          </div>
          <p className="text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your voice into a musical masterpiece. Real-time pitch
            detection meets gamification.
          </p>

          <motion.a
            href="/game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl shadow-purple-500/25 smooth-transition hover:shadow-purple-500/40 hover:scale-105 focus-ring"
          >
            <span className="text-xl">🎮</span>
            Start Playing
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.a>
        </motion.section>

        {/* Main Content */}
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Voice Tester */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            <div className="glass-strong rounded-3xl p-8 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-xl">🎤</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Voice Tester</h2>
              </div>

              <PitchDetector
                onPitchChange={(frequency, confidence) => {
                  console.log("Pitch detected:", { frequency, confidence });
                }}
                className="h-fit"
              />

              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-slate-300 leading-relaxed">
                  🎯 Test your microphone and voice detection here before
                  jumping into the full game experience.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="space-y-6"
          >
            {/* Game Features */}
            <div className="glass rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white">Game Features</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎵", label: "Real-time Pitch", desc: "Detection" },
                  { icon: "⚡", label: "Combo System", desc: "Multipliers" },
                  { icon: "🏆", label: "Progressive", desc: "Levels" },
                  { icon: "🎨", label: "Musical", desc: "Patterns" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl bg-white/5 smooth-transition hover:bg-white/10"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="text-white font-semibold text-sm">
                      {feature.label}
                    </div>
                    <div className="text-slate-400 text-xs">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="glass rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-white">How It Works</h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    text: "Test your voice with the detector",
                    icon: "🎤",
                  },
                  {
                    step: "2",
                    text: "Start the game and enable microphone",
                    icon: "🎮",
                  },
                  {
                    step: "3",
                    text: "Match falling notes by singing",
                    icon: "🎵",
                  },
                  {
                    step: "4",
                    text: "Build combos for massive scores",
                    icon: "🔥",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 smooth-transition hover:bg-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {item.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">
                        {item.text}
                      </span>
                    </div>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Showcase */}
            <div className="glass rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white">Powered By</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Next.js 15", color: "from-slate-600 to-slate-700" },
                  { name: "TypeScript", color: "from-blue-600 to-blue-700" },
                  {
                    name: "Web Audio API",
                    color: "from-green-600 to-green-700",
                  },
                  {
                    name: "Framer Motion",
                    color: "from-purple-600 to-purple-700",
                  },
                  { name: "Tailwind CSS", color: "from-cyan-600 to-cyan-700" },
                  { name: "Zustand", color: "from-orange-600 to-orange-700" },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`px-3 py-2 bg-gradient-to-r ${tech.color} text-white text-sm font-medium rounded-xl smooth-transition hover:scale-105`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="glass-strong rounded-3xl p-12 card-shadow max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Rock?
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Your voice is your instrument. Transform it into an interactive
              musical experience with real-time feedback and gamified learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/game"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/25 smooth-transition hover:shadow-purple-500/40 focus-ring"
              >
                <span className="text-xl">�</span>
                Launch Game
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 glass border border-white/20 text-white font-semibold rounded-2xl smooth-transition hover:bg-white/10 focus-ring"
              >
                <span className="text-xl">📖</span>
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-6 inline-block">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <span className="text-lg">🎵</span>
              <span className="font-medium">VocalVibe</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm">Crafted for music enthusiasts</span>
              <span className="text-slate-500">•</span>
              <span className="text-sm">Built with passion</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
