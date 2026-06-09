/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  workouts: {
    index: typeof routes['workouts.index']
    store: typeof routes['workouts.store']
    show: typeof routes['workouts.show']
    destroy: typeof routes['workouts.destroy']
    update: typeof routes['workouts.update']
  }
  exercises: {
    index: typeof routes['exercises.index']
    store: typeof routes['exercises.store']
    show: typeof routes['exercises.show']
    destroy: typeof routes['exercises.destroy']
    update: typeof routes['exercises.update']
  }
  schedules: {
    index: typeof routes['schedules.index']
    store: typeof routes['schedules.store']
    update: typeof routes['schedules.update']
    destroy: typeof routes['schedules.destroy']
  }
  workoutSessions: {
    store: typeof routes['workout_sessions.store']
    index: typeof routes['workout_sessions.index']
    show: typeof routes['workout_sessions.show']
    update: typeof routes['workout_sessions.update']
  }
  performances: {
    store: typeof routes['performances.store']
    index: typeof routes['performances.index']
  }
}
