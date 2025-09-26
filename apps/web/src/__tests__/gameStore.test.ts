import { renderHook, act } from "@testing-library/react";
import { useGameStore } from "@/stores/gameStore";

// Reset the store before each test
beforeEach(() => {
  useGameStore.setState({
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
  });
});

describe("GameStore", () => {
  describe("Game Controls", () => {
    it("should start game correctly", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.startGame("test-song");
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.currentSong).toBe("test-song");
      expect(result.current.notes.length).toBeGreaterThan(0);
    });

    it("should pause and resume game", () => {
      const { result } = renderHook(() => useGameStore());

      // Start game first
      act(() => {
        result.current.startGame();
      });

      // Pause game
      act(() => {
        result.current.pauseGame();
      });
      expect(result.current.isPaused).toBe(true);

      // Resume game
      act(() => {
        result.current.resumeGame();
      });
      expect(result.current.isPaused).toBe(false);
    });

    it("should reset game correctly", () => {
      const { result } = renderHook(() => useGameStore());

      // Set some game state
      act(() => {
        result.current.startGame();
        result.current.addScore(100);
      });

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.score).toBe(0);
      expect(result.current.combo).toBe(0);
      expect(result.current.currentSong).toBe(null);
    });
  });

  describe("Scoring System", () => {
    it("should handle note hits correctly", () => {
      const { result } = renderHook(() => useGameStore());

      // Start game to get notes
      act(() => {
        result.current.startGame();
      });

      const noteId = result.current.notes[0]?.id;
      if (!noteId) return;

      const initialScore = result.current.score;
      const initialCombo = result.current.combo;

      // Hit a note with high accuracy
      act(() => {
        result.current.hitNote(noteId, 0.95);
      });

      expect(result.current.score).toBeGreaterThan(initialScore);
      expect(result.current.combo).toBe(initialCombo + 1);
      expect(result.current.hitNotes).toBe(1);
      expect(result.current.perfectNotes).toBe(1);
    });

    it("should handle note misses correctly", () => {
      const { result } = renderHook(() => useGameStore());

      // Start game to get notes
      act(() => {
        result.current.startGame();
      });

      const noteId = result.current.notes[0]?.id;
      if (!noteId) return;

      // Build up some combo first
      act(() => {
        result.current.hitNote(result.current.notes[1]?.id || "test", 0.9);
      });

      const comboBeforeMiss = result.current.combo;

      // Miss a note
      act(() => {
        result.current.missNote(noteId);
      });

      expect(result.current.combo).toBe(0);
      expect(result.current.missedNotes).toBe(1);
      expect(comboBeforeMiss).toBeGreaterThan(0);
    });

    it("should calculate accuracy correctly", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        // Manually set up test data
        result.current.startGame();
        // Hit 3 out of 4 notes
        result.current.hitNote("note1", 0.9);
        result.current.hitNote("note2", 0.8);
        result.current.hitNote("note3", 0.9);
        result.current.missNote("note4");
      });

      // Calculate expected accuracy: 3 hits out of 4 total = 75%
      const totalNotes = result.current.hitNotes + result.current.missedNotes;
      const expectedAccuracy = (result.current.hitNotes / totalNotes) * 100;

      expect(expectedAccuracy).toBe(75);
    });
  });

  describe("Pitch Tracking", () => {
    it("should update current pitch", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.updatePitch(440); // A4
      });

      expect(result.current.currentPitch).toBe(440);
    });

    it("should set target pitch", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setTargetPitch(261.63); // C4
      });

      expect(result.current.targetPitch).toBe(261.63);
    });
  });

  describe("Settings", () => {
    it("should update difficulty within bounds", () => {
      const { result } = renderHook(() => useGameStore());

      // Test valid difficulty
      act(() => {
        result.current.setDifficulty(5);
      });
      expect(result.current.difficulty).toBe(5);

      // Test lower bound
      act(() => {
        result.current.setDifficulty(0);
      });
      expect(result.current.difficulty).toBe(1);

      // Test upper bound
      act(() => {
        result.current.setDifficulty(15);
      });
      expect(result.current.difficulty).toBe(10);
    });

    it("should update volume within bounds", () => {
      const { result } = renderHook(() => useGameStore());

      // Test valid volume
      act(() => {
        result.current.setVolume(0.5);
      });
      expect(result.current.volume).toBe(0.5);

      // Test lower bound
      act(() => {
        result.current.setVolume(-0.1);
      });
      expect(result.current.volume).toBe(0);

      // Test upper bound
      act(() => {
        result.current.setVolume(1.5);
      });
      expect(result.current.volume).toBe(1);
    });
  });
});
