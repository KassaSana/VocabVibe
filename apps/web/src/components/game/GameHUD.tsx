"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSafeGameStore } from "@/hooks/useClientGameStore";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface GameHUDProps {
  className?: string;
}

export function GameHUD({ className }: GameHUDProps) {
  const gameStore = useSafeGameStore();
  const {
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    combo,
    volume,
    setVolume,
    score,
    totalNotes,
    hitNotes,
    level,
  } = gameStore;

  const accuracy =
    totalNotes > 0 ? Math.round((hitNotes / totalNotes) * 100) : 0;

  const handlePlayPause = () => {
    if (!isPlaying) {
      startGame();
    } else if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const getComboColor = (combo: number) => {
    if (combo >= 20) return "from-amber-400 to-orange-500";
    if (combo >= 10) return "from-orange-400 to-red-500";
    if (combo >= 5) return "from-blue-400 to-purple-500";
    return "from-slate-400 to-slate-500";
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "from-emerald-500 to-green-600";
    if (accuracy >= 75) return "from-blue-500 to-cyan-600";
    if (accuracy >= 50) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6 card-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-semibold text-lg">Performance</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-1">
              {score.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Score
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-white mb-1">{level}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Level
            </div>
          </div>
        </div>
      </motion.div>

      {/* Combo Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 card-shadow relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-semibold text-lg">Combo</h2>
        </div>

        <div className="text-center relative z-10">
          <motion.div
            key={combo}
            initial={{ scale: 1 }}
            animate={{ scale: combo > 0 ? [1, 1.15, 1] : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-4xl font-black mb-2 bg-gradient-to-r ${getComboColor(combo)} bg-clip-text text-transparent`}
          >
            {combo}x
          </motion.div>

          {combo > 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-6xl animate-pulse">🔥</div>
            </motion.div>
          )}

          {combo > 0 && (
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-400/30">
                {combo >= 20
                  ? "LEGENDARY!"
                  : combo >= 10
                    ? "ON FIRE!"
                    : "STREAK!"}
              </Badge>
            </div>
          )}
        </div>
      </motion.div>

      {/* Accuracy Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 card-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-semibold text-lg">Accuracy</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span
              className={`text-3xl font-black bg-gradient-to-r ${getAccuracyColor(accuracy)} bg-clip-text text-transparent`}
            >
              {accuracy}%
            </span>
            <div className="text-right">
              <div className="text-sm text-white font-medium">
                {hitNotes}/{totalNotes}
              </div>
              <div className="text-xs text-slate-400">hits</div>
            </div>
          </div>

          <div className="relative">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`h-full bg-gradient-to-r ${getAccuracyColor(accuracy)} rounded-full relative`}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-6 card-shadow"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Controls</h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className={`flex-1 h-12 rounded-xl font-semibold smooth-transition ${
                isPlaying && !isPaused
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
              }`}
            >
              {!isPlaying ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Game
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>

            <Button
              onClick={resetGame}
              size="lg"
              className="h-12 px-4 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 smooth-transition"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <Volume2 className="w-4 h-4" />
                <span>Volume</span>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer focus-ring"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 card-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg">💡</span>
          </div>
          <h2 className="text-white font-semibold text-lg">Pro Tips</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: "🎯",
              tip: "Hit notes in the target zone for perfect scores",
            },
            { icon: "🎵", tip: "Match pitch within ±20Hz for best results" },
            { icon: "⚡", tip: "Chain consecutive hits for combo multipliers" },
            { icon: "🏆", tip: "Perfect hits award 100+ bonus points" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 smooth-transition hover:bg-white/10"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-slate-300 leading-relaxed">
                {item.tip}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
