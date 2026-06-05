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
