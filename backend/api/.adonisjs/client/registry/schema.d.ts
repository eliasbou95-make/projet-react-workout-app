/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
    }
  }
  'profile.profile.reset': {
    methods: ["DELETE"]
    pattern: '/api/v1/account/reset'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['reset']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['reset']>>>
    }
  }
  'profile.profile.update_password': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').changePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').changePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.update_email': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').changeEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').changeEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updateEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['updateEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.profile.destroy_account': {
    methods: ["DELETE"]
    pattern: '/api/v1/account/delete'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').deleteAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').deleteAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['destroyAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['destroyAccount']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'workouts.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workouts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['index']>>>
    }
  }
  'workouts.store': {
    methods: ["POST"]
    pattern: '/api/v1/workouts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/workout').createWorkoutValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/workout').createWorkoutValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'workouts.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workouts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['show']>>>
    }
  }
  'workouts.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/workouts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['destroy']>>>
    }
  }
  'workouts.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/workouts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/workout').createWorkoutValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/workout').createWorkoutValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workouts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exercises.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workouts/:workoutId/exercises'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['index']>>>
    }
  }
  'exercises.store': {
    methods: ["POST"]
    pattern: '/api/v1/workouts/:workoutId/exercises'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/exercise').createExerciseValidator)>>
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/exercise').createExerciseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exercises.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/workouts/:workoutId/exercises/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { workoutId: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['show']>>>
    }
  }
  'exercises.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/workouts/:workoutId/exercises/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { workoutId: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['destroy']>>>
    }
  }
  'exercises.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/workouts/:workoutId/exercises/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/exercise').updateExerciseValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { workoutId: ParamValue; id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/exercise').updateExerciseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercises_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schedules.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/schedules'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['index']>>>
    }
  }
  'schedules.store': {
    methods: ["POST"]
    pattern: '/api/v1/schedules'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/schedule').createScheduleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/schedule').createScheduleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schedules.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/schedules/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/schedule').updateScheduleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/schedule').updateScheduleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'schedules.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/schedules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['destroy']>>>
    }
  }
  'cycle_days.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/cycle'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['index']>>>
    }
  }
  'cycle_days.store': {
    methods: ["POST"]
    pattern: '/api/v1/cycle'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cycle_day').createCycleDayValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cycle_day').createCycleDayValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cycle_days.set_start_date': {
    methods: ["PATCH"]
    pattern: '/api/v1/cycle/start-date'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cycle_day').setCycleStartDateValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cycle_day').setCycleStartDateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setStartDate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setStartDate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cycle_days.set_repeat': {
    methods: ["PATCH"]
    pattern: '/api/v1/cycle/repeat'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cycle_day').setCycleRepeatValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cycle_day').setCycleRepeatValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setRepeat']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setRepeat']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cycle_days.set_end_rest': {
    methods: ["PATCH"]
    pattern: '/api/v1/cycle/end-rest'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cycle_day').setCycleEndRestValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cycle_day').setCycleEndRestValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setEndRest']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['setEndRest']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cycle_days.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/cycle/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cycle_days_controller').default['destroy']>>>
    }
  }
  'exercise_definitions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/exercise-definitions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['index']>>>
    }
  }
  'exercise_definitions.store': {
    methods: ["POST"]
    pattern: '/api/v1/exercise-definitions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/exercise_definition').createExerciseDefinitionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/exercise_definition').createExerciseDefinitionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'exercise_definitions.progression': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/exercise-definitions/:id/performances'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['progression']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['progression']>>>
    }
  }
  'exercise_definitions.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/exercise-definitions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/exercise_definitions_controller').default['destroy']>>>
    }
  }
  'sections.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/sections'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['index']>>>
    }
  }
  'sections.store': {
    methods: ["POST"]
    pattern: '/api/v1/sections'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/section').createSectionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/section').createSectionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'sections.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/sections/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sections_controller').default['destroy']>>>
    }
  }
  'day_overrides.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/day-overrides'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/day_overrides_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/day_overrides_controller').default['index']>>>
    }
  }
  'day_overrides.upsert': {
    methods: ["POST"]
    pattern: '/api/v1/day-overrides'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/day_override').upsertDayOverrideValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/day_override').upsertDayOverrideValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/day_overrides_controller').default['upsert']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/day_overrides_controller').default['upsert']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'workout_sessions.store': {
    methods: ["POST"]
    pattern: '/api/v1/workouts/:workoutId/sessions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['store']>>>
    }
  }
  'workout_sessions.skip': {
    methods: ["POST"]
    pattern: '/api/v1/workouts/:workoutId/sessions/skip'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['skip']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['skip']>>>
    }
  }
  'workout_sessions.complete': {
    methods: ["POST"]
    pattern: '/api/v1/workouts/:workoutId/sessions/complete'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['complete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['complete']>>>
    }
  }
  'workout_sessions.reset': {
    methods: ["POST"]
    pattern: '/api/v1/workouts/:workoutId/sessions/reset'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { workoutId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['reset']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['reset']>>>
    }
  }
  'workout_sessions.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/sessions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['index']>>>
    }
  }
  'workout_sessions.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/sessions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['show']>>>
    }
  }
  'workout_sessions.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/sessions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['update']>>>
    }
  }
  'workout_sessions.destroy_all': {
    methods: ["DELETE"]
    pattern: '/api/v1/sessions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['destroyAll']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['destroyAll']>>>
    }
  }
  'workout_sessions.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/sessions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/workout_sessions_controller').default['destroy']>>>
    }
  }
  'performances.store': {
    methods: ["POST"]
    pattern: '/api/v1/sessions/:sessionId/performances'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/performance').createPerformanceValidator)>>
      paramsTuple: [ParamValue]
      params: { sessionId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/performance').createPerformanceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'performances.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/sessions/:sessionId/performances'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { sessionId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['index']>>>
    }
  }
  'performances.last': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/exercises/:exerciseId/last-performance'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { exerciseId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['last']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/performances_controller').default['last']>>>
    }
  }
}
