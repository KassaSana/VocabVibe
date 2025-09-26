"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

export interface PitchData {
  frequency: number;
  confidence: number;
  timestamp: number;
}

export interface AudioEngineConfig {
  sampleRate?: number;
  bufferSize?: number;
  confidenceThreshold?: number;
}

export const useAudioEngine = (config: AudioEngineConfig = {}) => {
  const {
    sampleRate = 44100,
    bufferSize = 2048,
    confidenceThreshold = 0.8,
  } = config;

  const [isRecording, setIsRecording] = useState(false);
  const [currentPitch, setCurrentPitch] = useState<PitchData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pitchDetectorRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);

  const initializeAudio = useCallback(async () => {
    try {
      setError(null);

      // Get user media (microphone access)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: sampleRate,
        },
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate });
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = bufferSize * 2;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Create pitch detector
      pitchDetectorRef.current = PitchDetector.forFloat32Array(bufferSize);

      // Create data array for time domain data
      dataArrayRef.current = new Float32Array(new ArrayBuffer(bufferSize * 4));

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize audio";
      setError(errorMessage);
      console.error("Audio initialization failed:", err);
      return false;
    }
  }, [sampleRate, bufferSize]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    const initialized = await initializeAudio();
    if (!initialized) return;

    setIsRecording(true);

    // Start pitch detection loop
    const detectPitch = () => {
      if (
        !analyserRef.current ||
        !pitchDetectorRef.current ||
        !dataArrayRef.current ||
        !isRecording
      ) {
        return;
      }

      // Get time domain data
      const buffer = new ArrayBuffer(dataArrayRef.current!.length * 4);
      const floatArray = new Float32Array(buffer);
      analyserRef.current.getFloatTimeDomainData(floatArray);

      // Detect pitch
      const [frequency, confidence] = pitchDetectorRef.current.findPitch(
        floatArray,
        audioContextRef.current!.sampleRate
      );

      // Update pitch data if confidence is high enough
      if (confidence > confidenceThreshold) {
        setCurrentPitch({
          frequency,
          confidence,
          timestamp: Date.now(),
        });
      } else {
        setCurrentPitch(null);
      }

      // Continue the loop
      animationFrameRef.current = requestAnimationFrame(detectPitch);
    };

    detectPitch();
  }, [isRecording, initializeAudio, confidenceThreshold]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset refs
    analyserRef.current = null;
    pitchDetectorRef.current = null;
    dataArrayRef.current = null;

    // Clear current pitch
    setCurrentPitch(null);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  // Helper function to convert frequency to musical note
  const frequencyToNote = useCallback((frequency: number) => {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);

    if (frequency > 0) {
      const h = Math.round(12 * Math.log2(frequency / C0));
      const octave = Math.floor(h / 12);
      const n = h % 12;
      const notes = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ];
      return `${notes[n]}${octave}`;
    }

    return null;
  }, []);

  return {
    isRecording,
    currentPitch,
    error,
    startRecording,
    stopRecording,
    frequencyToNote,
    // Utility functions
    isSupported: () =>
      typeof navigator !== "undefined" && "mediaDevices" in navigator,
  };
};
