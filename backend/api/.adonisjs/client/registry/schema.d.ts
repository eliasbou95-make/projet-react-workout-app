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
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['store']>>>
    }
  }
  'schedules.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/schedules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/schedules_controller').default['update']>>>
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
}
