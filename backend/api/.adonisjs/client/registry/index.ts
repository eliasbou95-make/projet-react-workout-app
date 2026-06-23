/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'workouts.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workouts',
    tokens: [{"old":"/api/v1/workouts","type":0,"val":"api","end":""},{"old":"/api/v1/workouts","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts","type":0,"val":"workouts","end":""}],
    types: placeholder as Registry['workouts.index']['types'],
  },
  'workouts.store': {
    methods: ["POST"],
    pattern: '/api/v1/workouts',
    tokens: [{"old":"/api/v1/workouts","type":0,"val":"api","end":""},{"old":"/api/v1/workouts","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts","type":0,"val":"workouts","end":""}],
    types: placeholder as Registry['workouts.store']['types'],
  },
  'workouts.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workouts/:id',
    tokens: [{"old":"/api/v1/workouts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workouts.show']['types'],
  },
  'workouts.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/workouts/:id',
    tokens: [{"old":"/api/v1/workouts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workouts.destroy']['types'],
  },
  'workouts.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/workouts/:id',
    tokens: [{"old":"/api/v1/workouts/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workouts.update']['types'],
  },
  'exercises.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workouts/:workoutId/exercises',
    tokens: [{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"exercises","end":""}],
    types: placeholder as Registry['exercises.index']['types'],
  },
  'exercises.store': {
    methods: ["POST"],
    pattern: '/api/v1/workouts/:workoutId/exercises',
    tokens: [{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/exercises","type":0,"val":"exercises","end":""}],
    types: placeholder as Registry['exercises.store']['types'],
  },
  'exercises.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/workouts/:workoutId/exercises/:id',
    tokens: [{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"exercises","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exercises.show']['types'],
  },
  'exercises.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/workouts/:workoutId/exercises/:id',
    tokens: [{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"exercises","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exercises.destroy']['types'],
  },
  'exercises.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/workouts/:workoutId/exercises/:id',
    tokens: [{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":0,"val":"exercises","end":""},{"old":"/api/v1/workouts/:workoutId/exercises/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exercises.update']['types'],
  },
  'schedules.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/schedules',
    tokens: [{"old":"/api/v1/schedules","type":0,"val":"api","end":""},{"old":"/api/v1/schedules","type":0,"val":"v1","end":""},{"old":"/api/v1/schedules","type":0,"val":"schedules","end":""}],
    types: placeholder as Registry['schedules.index']['types'],
  },
  'schedules.store': {
    methods: ["POST"],
    pattern: '/api/v1/schedules',
    tokens: [{"old":"/api/v1/schedules","type":0,"val":"api","end":""},{"old":"/api/v1/schedules","type":0,"val":"v1","end":""},{"old":"/api/v1/schedules","type":0,"val":"schedules","end":""}],
    types: placeholder as Registry['schedules.store']['types'],
  },
  'schedules.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/schedules/:id',
    tokens: [{"old":"/api/v1/schedules/:id","type":0,"val":"api","end":""},{"old":"/api/v1/schedules/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/schedules/:id","type":0,"val":"schedules","end":""},{"old":"/api/v1/schedules/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schedules.update']['types'],
  },
  'schedules.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/schedules/:id',
    tokens: [{"old":"/api/v1/schedules/:id","type":0,"val":"api","end":""},{"old":"/api/v1/schedules/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/schedules/:id","type":0,"val":"schedules","end":""},{"old":"/api/v1/schedules/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['schedules.destroy']['types'],
  },
  'cycle_days.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/cycle',
    tokens: [{"old":"/api/v1/cycle","type":0,"val":"api","end":""},{"old":"/api/v1/cycle","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle","type":0,"val":"cycle","end":""}],
    types: placeholder as Registry['cycle_days.index']['types'],
  },
  'cycle_days.store': {
    methods: ["POST"],
    pattern: '/api/v1/cycle',
    tokens: [{"old":"/api/v1/cycle","type":0,"val":"api","end":""},{"old":"/api/v1/cycle","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle","type":0,"val":"cycle","end":""}],
    types: placeholder as Registry['cycle_days.store']['types'],
  },
  'cycle_days.set_start_date': {
    methods: ["PATCH"],
    pattern: '/api/v1/cycle/start-date',
    tokens: [{"old":"/api/v1/cycle/start-date","type":0,"val":"api","end":""},{"old":"/api/v1/cycle/start-date","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle/start-date","type":0,"val":"cycle","end":""},{"old":"/api/v1/cycle/start-date","type":0,"val":"start-date","end":""}],
    types: placeholder as Registry['cycle_days.set_start_date']['types'],
  },
  'cycle_days.set_repeat': {
    methods: ["PATCH"],
    pattern: '/api/v1/cycle/repeat',
    tokens: [{"old":"/api/v1/cycle/repeat","type":0,"val":"api","end":""},{"old":"/api/v1/cycle/repeat","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle/repeat","type":0,"val":"cycle","end":""},{"old":"/api/v1/cycle/repeat","type":0,"val":"repeat","end":""}],
    types: placeholder as Registry['cycle_days.set_repeat']['types'],
  },
  'cycle_days.set_end_rest': {
    methods: ["PATCH"],
    pattern: '/api/v1/cycle/end-rest',
    tokens: [{"old":"/api/v1/cycle/end-rest","type":0,"val":"api","end":""},{"old":"/api/v1/cycle/end-rest","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle/end-rest","type":0,"val":"cycle","end":""},{"old":"/api/v1/cycle/end-rest","type":0,"val":"end-rest","end":""}],
    types: placeholder as Registry['cycle_days.set_end_rest']['types'],
  },
  'cycle_days.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/cycle/:id',
    tokens: [{"old":"/api/v1/cycle/:id","type":0,"val":"api","end":""},{"old":"/api/v1/cycle/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/cycle/:id","type":0,"val":"cycle","end":""},{"old":"/api/v1/cycle/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['cycle_days.destroy']['types'],
  },
  'exercise_definitions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/exercise-definitions',
    tokens: [{"old":"/api/v1/exercise-definitions","type":0,"val":"api","end":""},{"old":"/api/v1/exercise-definitions","type":0,"val":"v1","end":""},{"old":"/api/v1/exercise-definitions","type":0,"val":"exercise-definitions","end":""}],
    types: placeholder as Registry['exercise_definitions.index']['types'],
  },
  'exercise_definitions.store': {
    methods: ["POST"],
    pattern: '/api/v1/exercise-definitions',
    tokens: [{"old":"/api/v1/exercise-definitions","type":0,"val":"api","end":""},{"old":"/api/v1/exercise-definitions","type":0,"val":"v1","end":""},{"old":"/api/v1/exercise-definitions","type":0,"val":"exercise-definitions","end":""}],
    types: placeholder as Registry['exercise_definitions.store']['types'],
  },
  'exercise_definitions.progression': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/exercise-definitions/:id/performances',
    tokens: [{"old":"/api/v1/exercise-definitions/:id/performances","type":0,"val":"api","end":""},{"old":"/api/v1/exercise-definitions/:id/performances","type":0,"val":"v1","end":""},{"old":"/api/v1/exercise-definitions/:id/performances","type":0,"val":"exercise-definitions","end":""},{"old":"/api/v1/exercise-definitions/:id/performances","type":1,"val":"id","end":""},{"old":"/api/v1/exercise-definitions/:id/performances","type":0,"val":"performances","end":""}],
    types: placeholder as Registry['exercise_definitions.progression']['types'],
  },
  'exercise_definitions.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/exercise-definitions/:id',
    tokens: [{"old":"/api/v1/exercise-definitions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/exercise-definitions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/exercise-definitions/:id","type":0,"val":"exercise-definitions","end":""},{"old":"/api/v1/exercise-definitions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['exercise_definitions.destroy']['types'],
  },
  'workout_sessions.store': {
    methods: ["POST"],
    pattern: '/api/v1/workouts/:workoutId/sessions',
    tokens: [{"old":"/api/v1/workouts/:workoutId/sessions","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/sessions","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/sessions","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/sessions","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/sessions","type":0,"val":"sessions","end":""}],
    types: placeholder as Registry['workout_sessions.store']['types'],
  },
  'workout_sessions.skip': {
    methods: ["POST"],
    pattern: '/api/v1/workouts/:workoutId/sessions/skip',
    tokens: [{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":0,"val":"sessions","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/skip","type":0,"val":"skip","end":""}],
    types: placeholder as Registry['workout_sessions.skip']['types'],
  },
  'workout_sessions.complete': {
    methods: ["POST"],
    pattern: '/api/v1/workouts/:workoutId/sessions/complete',
    tokens: [{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":0,"val":"sessions","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/complete","type":0,"val":"complete","end":""}],
    types: placeholder as Registry['workout_sessions.complete']['types'],
  },
  'workout_sessions.reset': {
    methods: ["POST"],
    pattern: '/api/v1/workouts/:workoutId/sessions/reset',
    tokens: [{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":0,"val":"api","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":0,"val":"v1","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":0,"val":"workouts","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":1,"val":"workoutId","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":0,"val":"sessions","end":""},{"old":"/api/v1/workouts/:workoutId/sessions/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['workout_sessions.reset']['types'],
  },
  'workout_sessions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/sessions',
    tokens: [{"old":"/api/v1/sessions","type":0,"val":"api","end":""},{"old":"/api/v1/sessions","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions","type":0,"val":"sessions","end":""}],
    types: placeholder as Registry['workout_sessions.index']['types'],
  },
  'workout_sessions.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/sessions/:id',
    tokens: [{"old":"/api/v1/sessions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"sessions","end":""},{"old":"/api/v1/sessions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workout_sessions.show']['types'],
  },
  'workout_sessions.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/sessions/:id',
    tokens: [{"old":"/api/v1/sessions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"sessions","end":""},{"old":"/api/v1/sessions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workout_sessions.update']['types'],
  },
  'workout_sessions.destroy_all': {
    methods: ["DELETE"],
    pattern: '/api/v1/sessions',
    tokens: [{"old":"/api/v1/sessions","type":0,"val":"api","end":""},{"old":"/api/v1/sessions","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions","type":0,"val":"sessions","end":""}],
    types: placeholder as Registry['workout_sessions.destroy_all']['types'],
  },
  'workout_sessions.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/sessions/:id',
    tokens: [{"old":"/api/v1/sessions/:id","type":0,"val":"api","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions/:id","type":0,"val":"sessions","end":""},{"old":"/api/v1/sessions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['workout_sessions.destroy']['types'],
  },
  'performances.store': {
    methods: ["POST"],
    pattern: '/api/v1/sessions/:sessionId/performances',
    tokens: [{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"api","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"sessions","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":1,"val":"sessionId","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"performances","end":""}],
    types: placeholder as Registry['performances.store']['types'],
  },
  'performances.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/sessions/:sessionId/performances',
    tokens: [{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"api","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"v1","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"sessions","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":1,"val":"sessionId","end":""},{"old":"/api/v1/sessions/:sessionId/performances","type":0,"val":"performances","end":""}],
    types: placeholder as Registry['performances.index']['types'],
  },
  'performances.last': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/exercises/:exerciseId/last-performance',
    tokens: [{"old":"/api/v1/exercises/:exerciseId/last-performance","type":0,"val":"api","end":""},{"old":"/api/v1/exercises/:exerciseId/last-performance","type":0,"val":"v1","end":""},{"old":"/api/v1/exercises/:exerciseId/last-performance","type":0,"val":"exercises","end":""},{"old":"/api/v1/exercises/:exerciseId/last-performance","type":1,"val":"exerciseId","end":""},{"old":"/api/v1/exercises/:exerciseId/last-performance","type":0,"val":"last-performance","end":""}],
    types: placeholder as Registry['performances.last']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
