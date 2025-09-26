import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
  email: z.string().email().optional(),
})

export const updateUserSchema = createUserSchema.partial()

// Song validation schemas
export const createSongSchema = z.object({
  title: z.string().min(1).max(255),
  artist: z.string().min(1).max(255),
  difficulty: z.number().int().min(1).max(10),
  bpm: z.number().int().min(60).max(200),
  durationMs: z.number().int().positive(),
  audioUrl: z.string().url().optional(),
  chartData: z.any().optional(), // JSON data for note charts
})

// Session validation schemas
export const startSessionSchema = z.object({
  songId: z.string().uuid().optional(),
})

export const endSessionSchema = z.object({
  score: z.number().int().min(0).max(100000),
  accuracy: z.number().min(0).max(100),
  maxCombo: z.number().int().min(0),
  perfectNotes: z.number().int().min(0),
  missedNotes: z.number().int().min(0),
})

// Progress validation schemas
export const updateProgressSchema = z.object({
  bestScore: z.number().int().min(0).optional(),
  playCount: z.number().int().min(0).optional(),
  mastered: z.boolean().optional(),
})

// API Response schemas
export const successResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
})

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
})

export const apiResponseSchema = z.union([successResponseSchema, errorResponseSchema])

// Pitch detection schemas
export const pitchDataSchema = z.object({
  frequency: z.number().min(0),
  confidence: z.number().min(0).max(1),
  timestamp: z.number(),
})

export const noteEventSchema = z.object({
  type: z.enum(['hit', 'miss', 'perfect']),
  targetFrequency: z.number(),
  actualFrequency: z.number().optional(),
  timestamp: z.number(),
  score: z.number().int(),
})

// Game state schemas
export const gameStateSchema = z.object({
  isPlaying: z.boolean(),
  currentTime: z.number(),
  score: z.number().int(),
  combo: z.number().int(),
  accuracy: z.number().min(0).max(100),
  level: z.number().int().positive(),
})

// Types
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type CreateSong = z.infer<typeof createSongSchema>
export type StartSession = z.infer<typeof startSessionSchema>
export type EndSession = z.infer<typeof endSessionSchema>
export type UpdateProgress = z.infer<typeof updateProgressSchema>
export type SuccessResponse<T = any> = z.infer<typeof successResponseSchema> & { data: T }
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse
export type PitchData = z.infer<typeof pitchDataSchema>
export type NoteEvent = z.infer<typeof noteEventSchema>
export type GameState = z.infer<typeof gameStateSchema>