"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Note {
  id: string;
  frequency: number;
  targetTime: number;
  duration: number;
  lane: number;
  hit: boolean;
  perfect: boolean;
  missed: boolean;
}

export interface GameState {
  // Game status
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;

  // Score and progression
  score: number;
  combo: number;
  maxCombo: number;
  level: number;
  xp: number;

  // Accuracy tracking
  totalNotes: number;
  hitNotes: number;
  perfectNotes: number;
  missedNotes: number;

  // Current song/lesson
  currentSong: string | null;
  notes: Note[];

  // Real-time pitch
  currentPitch: number | null;
  targetPitch: number | null;

  // Settings
  difficulty: number;
  volume: number;
}

export interface GameActions {
  // Game controls
  startGame: (songId?: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;

  // Time management
  updateTime: (time: number) => void;

  // Note interactions
  hitNote: (noteId: string, accuracy: number) => void;
  missNote: (noteId: string) => void;

  // Pitch tracking
  updatePitch: (frequency: number) => void;
  setTargetPitch: (frequency: number | null) => void;

  // Score management
  addScore: (points: number) => void;
  resetCombo: () => void;

  // Settings
  setDifficulty: (level: number) => void;
  setVolume: (volume: number) => void;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
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
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Game controls
    startGame: (songId?: string) => {
      const state = get();
      set({
        isPlaying: true,
        isPaused: false,
        currentTime: 0,
        currentSong: songId || "demo-song",
        notes: generateDemoNotes(state.difficulty),
        // Reset game stats
        score: 0,
        combo: 0,
        totalNotes: 0,
        hitNotes: 0,
        perfectNotes: 0,
        missedNotes: 0,
      });
    },

    pauseGame: () => {
      set({ isPaused: true });
    },

    resumeGame: () => {
      set({ isPaused: false });
    },

    resetGame: () => {
      set({
        ...initialState,
        // Keep settings
        difficulty: get().difficulty,
        volume: get().volume,
      });
    },

    // Time management
    updateTime: (time: number) => {
      set({ currentTime: time });
    },

    // Note interactions
    hitNote: (noteId: string, accuracy: number) => {
      const state = get();
      const note = state.notes.find((n) => n.id === noteId);

      if (!note || note.hit) return;

      const isPerfect = accuracy >= 0.95;
      const isGood = accuracy >= 0.75;
      const isOkay = accuracy >= 0.5;

      let points = 0;
      let comboMultiplier = 1;

      // Combo multiplier increases with combo count
      if (state.combo >= 50) comboMultiplier = 4;
      else if (state.combo >= 25) comboMultiplier = 3;
      else if (state.combo >= 10) comboMultiplier = 2;

      if (isPerfect) {
        points = Math.floor((100 + state.combo * 15) * comboMultiplier);
      } else if (isGood) {
        points = Math.floor((75 + state.combo * 10) * comboMultiplier);
      } else if (isOkay) {
        points = Math.floor((50 + state.combo * 5) * comboMultiplier);
      } else {
        points = Math.floor(25 * comboMultiplier);
      }

      const newScore = state.score + points;
      const newCombo = state.combo + 1;
      const newLevel = Math.floor(newScore / 10000) + 1; // Level up every 10k points
      const newXP = newScore % 10000;

      set({
        score: newScore,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        level: newLevel,
        xp: newXP,
        hitNotes: state.hitNotes + 1,
        totalNotes: state.totalNotes + 1,
        perfectNotes: isPerfect ? state.perfectNotes + 1 : state.perfectNotes,
        notes: state.notes.map((n) =>
          n.id === noteId ? { ...n, hit: true, perfect: isPerfect } : n
        ),
      });
    },

    missNote: (noteId: string) => {
      const state = get();
      set({
        combo: 0, // Reset combo on miss
        missedNotes: state.missedNotes + 1,
        totalNotes: state.totalNotes + 1,
        notes: state.notes.map((n) =>
          n.id === noteId ? { ...n, missed: true } : n
        ),
      });
    },

    // Pitch tracking
    updatePitch: (frequency: number) => {
      set({ currentPitch: frequency });
    },

    setTargetPitch: (frequency: number | null) => {
      set({ targetPitch: frequency });
    },

    // Score management
    addScore: (points: number) => {
      set((state) => ({ score: state.score + points }));
    },

    resetCombo: () => {
      set({ combo: 0 });
    },

    // Settings
    setDifficulty: (level: number) => {
      set({ difficulty: Math.max(1, Math.min(10, level)) });
    },

    setVolume: (volume: number) => {
      set({ volume: Math.max(0, Math.min(1, volume)) });
    },
  }))
);

// Musical patterns and scales for better gameplay
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11], // Major scale intervals
  minor: [0, 2, 3, 5, 7, 8, 10], // Natural minor scale intervals
  pentatonic: [0, 2, 4, 7, 9], // Pentatonic scale intervals
  blues: [0, 3, 5, 6, 7, 10], // Blues scale intervals
};

const NOTE_PATTERNS = {
  ascending: (scale: number[], length: number) =>
    Array.from({ length }, (_, i) => scale[i % scale.length]),

  descending: (scale: number[], length: number) =>
    Array.from(
      { length },
      (_, i) => scale[scale.length - 1 - (i % scale.length)]
    ),

  arpeggios: (scale: number[], length: number) =>
    Array.from({ length }, (_, i) => scale[(i * 2) % scale.length]),

  random: (scale: number[], length: number) =>
    Array.from(
      { length },
      () => scale[Math.floor(Math.random() * scale.length)]
    ),

  waves: (scale: number[], length: number) =>
    Array.from({ length }, (_, i) => {
      const pos = Math.sin((i / length) * Math.PI * 4) * 0.5 + 0.5;
      return scale[Math.floor(pos * scale.length)];
    }),
};

// Generate demo notes for testing - deterministic to avoid hydration issues
function generateDemoNotes(difficulty: number = 1): Note[] {
  const notes: Note[] = [];
  const baseFreq = 261.63; // C4

  // Choose pattern and scale based on difficulty
  const patternNames = Object.keys(NOTE_PATTERNS) as Array<
    keyof typeof NOTE_PATTERNS
  >;
  const patternName = patternNames[difficulty % patternNames.length];

  const scale =
    difficulty <= 3
      ? SCALES.pentatonic
      : difficulty <= 6
        ? SCALES.major
        : difficulty <= 8
          ? SCALES.minor
          : SCALES.blues;

  const noteCount = Math.min(10 + difficulty * 2, 25);
  const interval = Math.max(1000, 2500 - difficulty * 150);

  const pattern = NOTE_PATTERNS[patternName](scale, noteCount);

  for (let i = 0; i < pattern.length; i++) {
    const semitone = pattern[i];
    const frequency = baseFreq * Math.pow(2, semitone / 12); // Convert semitone to frequency

    notes.push({
      id: `note-${i}`,
      frequency: Math.round(frequency * 100) / 100, // Round for consistency
      targetTime: i * interval,
      duration: Math.max(800, 1200 - difficulty * 40),
      lane: semitone % 4, // Use semitone to determine lane for musical consistency
      hit: false,
      perfect: false,
      missed: false,
    });
  }

  return notes;
}

// Selectors for easy access
export const selectGameStats = (state: GameStore) => ({
  score: state.score,
  combo: state.combo,
  accuracy:
    state.totalNotes > 0 ? (state.hitNotes / state.totalNotes) * 100 : 0,
  level: state.level,
});

export const selectActiveNotes = (state: GameStore) =>
  state.notes.filter(
    (note) =>
      !note.hit &&
      !note.missed &&
      note.targetTime - 2000 <= state.currentTime &&
      note.targetTime + note.duration + 1000 >= state.currentTime
  );
