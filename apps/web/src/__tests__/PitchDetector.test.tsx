import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PitchDetector } from "@/components/audio/PitchDetector";

// Mock the useAudioEngine hook
const mockUseAudioEngine = jest.fn();

jest.mock("@/hooks/useAudioEngine", () => ({
  useAudioEngine: mockUseAudioEngine,
}));

describe("PitchDetector", () => {
  beforeEach(() => {
    mockUseAudioEngine.mockClear();
  });

  it("renders correctly when not recording", () => {
    mockUseAudioEngine.mockReturnValue({
      isRecording: false,
      currentPitch: null,
      error: null,
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      frequencyToNote: (freq: number) => (freq === 440 ? "A4" : "C4"),
      isSupported: () => true,
    });

    render(<PitchDetector />);

    expect(screen.getByText("🎤 Pitch Detector")).toBeInTheDocument();
    expect(
      screen.getByText("Click the microphone to start")
    ).toBeInTheDocument();
  });

  it("shows unsupported message when audio not supported", () => {
    mockUseAudioEngine.mockReturnValue({
      isRecording: false,
      currentPitch: null,
      error: null,
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      frequencyToNote: jest.fn(),
      isSupported: () => false,
    });

    render(<PitchDetector />);

    expect(
      screen.getByText("Audio recording is not supported in this browser")
    ).toBeInTheDocument();
  });

  it("displays error messages correctly", () => {
    mockUseAudioEngine.mockReturnValue({
      isRecording: false,
      currentPitch: null,
      error: "Microphone access denied",
      startRecording: jest.fn(),
      stopRecording: jest.fn(),
      frequencyToNote: jest.fn(),
      isSupported: () => true,
    });

    render(<PitchDetector />);

    expect(screen.getByText("Microphone access denied")).toBeInTheDocument();
  });
});
