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
      reset: typeof routes['profile.profile.reset']
      updatePassword: typeof routes['profile.profile.update_password']
      updateEmail: typeof routes['profile.profile.update_email']
      destroyAccount: typeof routes['profile.profile.destroy_account']
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
  cycleDays: {
    index: typeof routes['cycle_days.index']
    store: typeof routes['cycle_days.store']
    setStartDate: typeof routes['cycle_days.set_start_date']
    setRepeat: typeof routes['cycle_days.set_repeat']
    setEndRest: typeof routes['cycle_days.set_end_rest']
    destroy: typeof routes['cycle_days.destroy']
  }
  exerciseDefinitions: {
    index: typeof routes['exercise_definitions.index']
    store: typeof routes['exercise_definitions.store']
    progression: typeof routes['exercise_definitions.progression']
    destroy: typeof routes['exercise_definitions.destroy']
  }
  sections: {
    index: typeof routes['sections.index']
    store: typeof routes['sections.store']
    destroy: typeof routes['sections.destroy']
  }
  dayOverrides: {
    index: typeof routes['day_overrides.index']
    upsert: typeof routes['day_overrides.upsert']
  }
  workoutSessions: {
    store: typeof routes['workout_sessions.store']
    skip: typeof routes['workout_sessions.skip']
    complete: typeof routes['workout_sessions.complete']
    reset: typeof routes['workout_sessions.reset']
    index: typeof routes['workout_sessions.index']
    show: typeof routes['workout_sessions.show']
    update: typeof routes['workout_sessions.update']
    destroyAll: typeof routes['workout_sessions.destroy_all']
    destroy: typeof routes['workout_sessions.destroy']
  }
  performances: {
    store: typeof routes['performances.store']
    index: typeof routes['performances.index']
    last: typeof routes['performances.last']
  }
}
