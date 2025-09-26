import { renderHook, act } from "@testing-library/react";
import { useAudioEngine } from "@/hooks/useAudioEngine";

// Mock pitchy
jest.mock("pitchy", () => ({
  PitchDetector: {
    forFloat32Array: jest.fn(() => ({
      findPitch: jest.fn(() => [440, 0.9]), // Return A4 with high confidence
    })),
  },
}));

describe("useAudioEngine", () => {
  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useAudioEngine());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.currentPitch).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isSupported()).toBe(true);
  });

  it("should handle audio initialization failure gracefully", async () => {
    // Mock getUserMedia to fail
    const mockGetUserMedia = jest
      .fn()
      .mockRejectedValue(new Error("Permission denied"));
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      value: {
        getUserMedia: mockGetUserMedia,
      },
    });

    const { result } = renderHook(() => useAudioEngine());

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.error).toBe("Permission denied");
    expect(result.current.isRecording).toBe(false);
  });

  it("should convert frequency to musical note correctly", () => {
    const { result } = renderHook(() => useAudioEngine());

    // Test A4 = 440Hz
    expect(result.current.frequencyToNote(440)).toBe("A4");

    // Test C4 = 261.63Hz
    expect(result.current.frequencyToNote(261.63)).toBe("C4");

    // Test invalid frequency
    expect(result.current.frequencyToNote(0)).toBeNull();
  });

  it("should stop recording and cleanup resources", async () => {
    const { result } = renderHook(() => useAudioEngine());

    // Start recording first
    await act(async () => {
      await result.current.startRecording();
    });

    // Stop recording
    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.currentPitch).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
