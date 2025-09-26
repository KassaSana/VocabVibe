import { act, renderHook } from "@testing-library/react";
import { useGameStore } from "@/stores/gameStore";

describe("GameStore Integration", () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().resetGame();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useGameStore());

    expect(result.current.score).toBe(0);
    expect(result.current.combo).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.notes).toHaveLength(0);
    expect(result.current.difficulty).toBe(1);
    expect(result.current.volume).toBe(0.5);
  });

  it("should start game correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.notes.length).toBeGreaterThan(0);
  });

  it("should handle scoring correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.startGame();
      result.current.addScore(100);
    });

    expect(result.current.score).toBe(100);
  });

  it("should update difficulty within bounds", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.setDifficulty(5);
    });

    expect(result.current.difficulty).toBe(5);

    act(() => {
      result.current.setDifficulty(15); // Should clamp to 10
    });

    expect(result.current.difficulty).toBe(10);
  });

  it("should handle note interactions", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.startGame();
    });

    const initialTotalNotes = result.current.totalNotes;
    const firstNote = result.current.notes[0];

    if (firstNote) {
      act(() => {
        result.current.hitNote(firstNote.id, 0.9); // Good accuracy
      });

      expect(result.current.hitNotes).toBe(1);
      expect(result.current.combo).toBeGreaterThan(0);
    }
  });

  it("should update pitch correctly", () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.updatePitch(440); // A4 note
    });

    expect(result.current.currentPitch).toBe(440);

    act(() => {
      result.current.setTargetPitch(523.25); // C5 note
    });

    expect(result.current.targetPitch).toBe(523.25);
  });
});
