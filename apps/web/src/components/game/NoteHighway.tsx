"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeGameStore } from "@/hooks/useClientGameStore";
import { Card } from "@/components/ui/card";

interface NoteHighwayProps {
  width?: number;
  height?: number;
  className?: string;
}

export function NoteHighway({
  width = 400,
  height = 600,
  className,
}: NoteHighwayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const gameStore = useSafeGameStore();
  const {
    isPlaying,
    currentTime,
    currentPitch,
    targetPitch,
    updateTime,
    hitNote,
    missNote,
    notes,
  } = gameStore;

  // Filter active notes (similar to selectActiveNotes)
  const activeNotes = notes.filter(
    (note) =>
      !note.hit &&
      !note.missed &&
      note.targetTime - 2000 <= currentTime &&
      note.targetTime + note.duration + 1000 >= currentTime
  );

  // Game time loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      updateTime(Date.now());
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, updateTime]);

  // Auto-miss notes that passed the hit zone
  useEffect(() => {
    activeNotes.forEach((note) => {
      const timePassed = currentTime - note.targetTime;
      if (timePassed > note.duration + 500) {
        // 500ms grace period
        missNote(note.id);
      }
    });
  }, [activeNotes, currentTime, missNote]);

  // Check for hits when pitch matches
  useEffect(() => {
    if (!currentPitch || !isPlaying) return;

    activeNotes.forEach((note) => {
      const timeDiff = Math.abs(currentTime - note.targetTime);
      const pitchDiff = Math.abs(currentPitch - note.frequency);

      // Hit zone: within 200ms of target time and within 20Hz of target frequency
      if (timeDiff <= 200 && pitchDiff <= 20 && !note.hit) {
        const accuracy = 1 - (timeDiff / 200) * 0.5 - (pitchDiff / 20) * 0.5;
        hitNote(note.id, Math.max(0, accuracy));
      }
    });
  }, [currentPitch, currentTime, activeNotes, hitNote, isPlaying]);

  // Calculate note position based on time
  const getNoteY = (note: any) => {
    const timeUntilHit = note.targetTime - currentTime;
    const fallDuration = 2000; // 2 seconds to fall
    const progress = 1 - timeUntilHit / fallDuration;
    return progress * height;
  };

  // Convert frequency to lane (simplified)
  const getLaneX = (frequency: number) => {
    const lanes = 5;
    const laneWidth = width / lanes;
    // Map frequency to lane (very simplified)
    const laneIndex = Math.floor(((frequency - 200) / 600) * lanes) % lanes;
    return laneIndex * laneWidth + laneWidth / 2;
  };

  if (!isPlaying) {
    return (
      <Card
        className={`${className} relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-purple-500/30`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-4xl mb-2">🎵</div>
            <div className="text-lg">Press Start to Play!</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      ref={containerRef}
      className={`${className} relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-blue-900/20 border-purple-500/30`}
      style={{ width, height }}
    >
      {/* Highway Lanes */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-white/20"
            style={{ left: `${(i / 5) * 100}%` }}
          />
        ))}
      </div>

      {/* Hit Zone */}
      <div
        className="absolute w-full h-20 bg-gradient-to-r from-green-500/30 to-blue-500/30 border-y-2 border-green-400/50"
        style={{ bottom: "100px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/80 font-semibold">HIT ZONE</span>
        </div>
      </div>

      {/* Falling Notes */}
      <AnimatePresence>
        {activeNotes.map((note) => {
          const y = getNoteY(note);
          const x = getLaneX(note.frequency);

          // Don't render notes that haven't entered the screen yet
          if (y < -50) return null;

          return (
            <motion.div
              key={note.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: note.hit ? 0 : 1,
                y: note.hit ? y - 50 : 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute w-12 h-12 rounded-full border-2 ${
                note.hit
                  ? note.perfect
                    ? "bg-green-500 border-green-300"
                    : "bg-yellow-500 border-yellow-300"
                  : note.missed
                    ? "bg-red-500 border-red-300"
                    : "bg-purple-500 border-purple-300"
              } shadow-lg flex items-center justify-center`}
              style={{
                left: x - 24, // Center the note
                top: y - 24,
              }}
            >
              {/* Musical note symbol */}
              <span className="text-white font-bold text-lg">♪</span>

              {/* Hit effects */}
              {note.hit && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  className={`absolute inset-0 rounded-full ${
                    note.perfect ? "bg-green-400" : "bg-yellow-400"
                  }`}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Current Pitch Indicator */}
      {currentPitch && (
        <motion.div
          animate={{ x: getLaneX(currentPitch) - 8 }}
          className="absolute w-4 h-4 bg-white rounded-full border-2 border-blue-400 shadow-lg"
          style={{ bottom: "110px" }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-full h-full bg-blue-400 rounded-full"
          />
        </motion.div>
      )}

      {/* Target Pitch Guide */}
      {targetPitch && (
        <div
          className="absolute w-6 h-1 bg-green-400/60 rounded"
          style={{
            left: getLaneX(targetPitch) - 12,
            bottom: "110px",
          }}
        />
      )}

      {/* Particle effects for hits */}
      <div className="absolute inset-0 pointer-events-none">
        {/* We'll add particle effects here later */}
      </div>
    </Card>
  );
}
