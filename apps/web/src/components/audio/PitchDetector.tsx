"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface PitchDetectorProps {
  onPitchChange?: (frequency: number, confidence: number) => void;
  className?: string;
}

export function PitchDetector({
  onPitchChange,
  className,
}: PitchDetectorProps) {
  const {
    isRecording,
    currentPitch,
    error,
    startRecording,
    stopRecording,
    frequencyToNote,
    isSupported,
  } = useAudioEngine({
    confidenceThreshold: 0.7,
    bufferSize: 2048,
  });

  // Call the callback when pitch changes
  useEffect(() => {
    if (currentPitch && onPitchChange) {
      onPitchChange(currentPitch.frequency, currentPitch.confidence);
    }
  }, [currentPitch, onPitchChange]);

  if (!isSupported()) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">
            Audio recording is not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

  const note = currentPitch ? frequencyToNote(currentPitch.frequency) : null;
  const confidencePercent = currentPitch
    ? Math.round(currentPitch.confidence * 100)
    : 0;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">🎤 Pitch Detector</h3>
            <p className="text-sm text-muted-foreground">
              {isRecording
                ? "Listening to your voice..."
                : "Click the microphone to start"}
            </p>
          </div>

          {/* Record Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!!error}
              className="rounded-full h-16 w-16"
            >
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{
                  repeat: isRecording ? Infinity : 0,
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                {isRecording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </motion.div>
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Pitch Display */}
          <AnimatePresence mode="wait">
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                {/* Current Pitch Visualization */}
                <div className="text-center">
                  {currentPitch ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      key={note}
                      className="space-y-2"
                    >
                      {/* Musical Note */}
                      <div className="text-4xl font-bold text-primary">
                        {note || "?"}
                      </div>

                      {/* Frequency */}
                      <div className="text-sm text-muted-foreground">
                        {Math.round(currentPitch.frequency)} Hz
                      </div>

                      {/* Confidence Badge */}
                      <Badge
                        variant={
                          confidencePercent > 80 ? "default" : "secondary"
                        }
                      >
                        {confidencePercent}% confidence
                      </Badge>
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-2xl text-muted-foreground"
                    >
                      Listening...
                    </motion.div>
                  )}
                </div>

                {/* Pitch Visualization Bar */}
                {currentPitch && (
                  <div className="space-y-2">
                    <div className="text-xs text-center text-muted-foreground">
                      Pitch Strength
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidencePercent}%` }}
                        className={`h-full rounded-full transition-colors duration-300 ${
                          confidencePercent > 80
                            ? "bg-green-500"
                            : confidencePercent > 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!isRecording && !error && (
            <div className="text-center text-xs text-muted-foreground">
              <p>Click the microphone and sing a note!</p>
              <p className="mt-1">Works best in a quiet environment</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
