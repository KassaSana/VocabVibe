"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import type { GameStore } from "@/stores/gameStore";

// Client-only hook that prevents hydration mismatches
export function useClientGameStore(): GameStore | null {
  const [isClient, setIsClient] = useState(false);
  const gameStore = useGameStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return gameStore;
}

// Safe hook for accessing game store with fallback
export function useSafeGameStore() {
  const store = useClientGameStore();

  // Return a safe default state when store is not ready
  const fallbackState: GameStore = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    level: 1,
    xp: 0,
    totalNotes: 0,
    hitNotes: 0,
    perfectNotes: 0,
    missedNotes: 0,
    currentSong: null,
    notes: [],
    currentPitch: null,
    targetPitch: null,
    difficulty: 1,
    volume: 0.8,
    startGame: () => {},
    pauseGame: () => {},
    resumeGame: () => {},
    resetGame: () => {},
    updateTime: () => {},
    hitNote: () => {},
    missNote: () => {},
    updatePitch: () => {},
    setTargetPitch: () => {},
    addScore: () => {},
    resetCombo: () => {},
    setDifficulty: () => {},
    setVolume: () => {},
  };

  return store || fallbackState;
}
