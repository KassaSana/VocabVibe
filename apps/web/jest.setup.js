require("@testing-library/jest-dom");

// Mock Web Audio API for tests
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockReturnValue({
    fftSize: 2048,
    smoothingTimeConstant: 0.3,
    getFloatTimeDomainData: jest.fn(),
  }),
  createMediaStreamSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
  }),
  sampleRate: 44100,
  close: jest.fn(),
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, "mediaDevices", {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
    }),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));
