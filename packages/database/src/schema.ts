import { pgTable, uuid, varchar, timestamp, integer, jsonb, boolean, real } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table - Keep it simple for MVP
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  streakDays: integer('streak_days').default(0).notNull(),
  currentLevel: integer('current_level').default(1).notNull(),
  totalXP: integer('total_xp').default(0).notNull(),
})

// Songs table - Content to practice
export const songs = pgTable('songs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  difficulty: integer('difficulty').notNull(), // 1-10
  bpm: integer('bpm').notNull(),
  durationMs: integer('duration_ms').notNull(),
  audioUrl: varchar('audio_url', { length: 500 }),
  chartData: jsonb('chart_data'), // Note timing data
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Sessions table - Every practice attempt  
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: uuid('song_id').references(() => songs.id, { onDelete: 'set null' }),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  score: integer('score').default(0).notNull(),
  accuracy: real('accuracy').default(0).notNull(), // 0-100%
  maxCombo: integer('max_combo').default(0).notNull(),
  perfectNotes: integer('perfect_notes').default(0).notNull(),
  missedNotes: integer('missed_notes').default(0).notNull(),
})

// Progress table - Track learning per song
export const progress = pgTable('progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: uuid('song_id').notNull().references(() => songs.id, { onDelete: 'cascade' }),
  bestScore: integer('best_score').default(0).notNull(),
  playCount: integer('play_count').default(0).notNull(),
  mastered: boolean('mastered').default(false).notNull(),
  lastPlayedAt: timestamp('last_played_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  progress: many(progress),
}))

export const songsRelations = relations(songs, ({ many }) => ({
  sessions: many(sessions),
  progress: many(progress),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [sessions.songId],
    references: [songs.id],
  }),
}))

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [progress.songId],
    references: [songs.id],
  }),
}))

// Types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Song = typeof songs.$inferSelect
export type NewSong = typeof songs.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Progress = typeof progress.$inferSelect
export type NewProgress = typeof progress.$inferInsert