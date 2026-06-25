import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.reset': { paramsTuple?: []; params?: {} }
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'profile.profile.update_email': { paramsTuple?: []; params?: {} }
    'profile.profile.destroy_account': { paramsTuple?: []; params?: {} }
    'workouts.index': { paramsTuple?: []; params?: {} }
    'workouts.store': { paramsTuple?: []; params?: {} }
    'workouts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workouts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workouts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercises.index': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'exercises.store': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'exercises.show': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'exercises.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'exercises.update': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'schedules.index': { paramsTuple?: []; params?: {} }
    'schedules.store': { paramsTuple?: []; params?: {} }
    'schedules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'schedules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cycle_days.index': { paramsTuple?: []; params?: {} }
    'cycle_days.store': { paramsTuple?: []; params?: {} }
    'cycle_days.set_start_date': { paramsTuple?: []; params?: {} }
    'cycle_days.set_repeat': { paramsTuple?: []; params?: {} }
    'cycle_days.set_end_rest': { paramsTuple?: []; params?: {} }
    'cycle_days.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise_definitions.index': { paramsTuple?: []; params?: {} }
    'exercise_definitions.store': { paramsTuple?: []; params?: {} }
    'exercise_definitions.progression': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise_definitions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sections.index': { paramsTuple?: []; params?: {} }
    'sections.store': { paramsTuple?: []; params?: {} }
    'sections.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'day_overrides.index': { paramsTuple?: []; params?: {} }
    'day_overrides.upsert': { paramsTuple?: []; params?: {} }
    'workout_sessions.store': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.skip': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.complete': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.reset': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.index': { paramsTuple?: []; params?: {} }
    'workout_sessions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workout_sessions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workout_sessions.destroy_all': { paramsTuple?: []; params?: {} }
    'workout_sessions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'performances.store': { paramsTuple: [ParamValue]; params: {'sessionId': ParamValue} }
    'performances.index': { paramsTuple: [ParamValue]; params: {'sessionId': ParamValue} }
    'performances.last': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'workouts.index': { paramsTuple?: []; params?: {} }
    'workouts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercises.index': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'exercises.show': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'schedules.index': { paramsTuple?: []; params?: {} }
    'cycle_days.index': { paramsTuple?: []; params?: {} }
    'exercise_definitions.index': { paramsTuple?: []; params?: {} }
    'exercise_definitions.progression': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sections.index': { paramsTuple?: []; params?: {} }
    'day_overrides.index': { paramsTuple?: []; params?: {} }
    'workout_sessions.index': { paramsTuple?: []; params?: {} }
    'workout_sessions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'performances.index': { paramsTuple: [ParamValue]; params: {'sessionId': ParamValue} }
    'performances.last': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'workouts.index': { paramsTuple?: []; params?: {} }
    'workouts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercises.index': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'exercises.show': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'schedules.index': { paramsTuple?: []; params?: {} }
    'cycle_days.index': { paramsTuple?: []; params?: {} }
    'exercise_definitions.index': { paramsTuple?: []; params?: {} }
    'exercise_definitions.progression': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sections.index': { paramsTuple?: []; params?: {} }
    'day_overrides.index': { paramsTuple?: []; params?: {} }
    'workout_sessions.index': { paramsTuple?: []; params?: {} }
    'workout_sessions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'performances.index': { paramsTuple: [ParamValue]; params: {'sessionId': ParamValue} }
    'performances.last': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'workouts.store': { paramsTuple?: []; params?: {} }
    'exercises.store': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'schedules.store': { paramsTuple?: []; params?: {} }
    'cycle_days.store': { paramsTuple?: []; params?: {} }
    'exercise_definitions.store': { paramsTuple?: []; params?: {} }
    'sections.store': { paramsTuple?: []; params?: {} }
    'day_overrides.upsert': { paramsTuple?: []; params?: {} }
    'workout_sessions.store': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.skip': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.complete': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'workout_sessions.reset': { paramsTuple: [ParamValue]; params: {'workoutId': ParamValue} }
    'performances.store': { paramsTuple: [ParamValue]; params: {'sessionId': ParamValue} }
  }
  DELETE: {
    'profile.profile.reset': { paramsTuple?: []; params?: {} }
    'profile.profile.destroy_account': { paramsTuple?: []; params?: {} }
    'workouts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercises.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'schedules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cycle_days.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise_definitions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sections.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'workout_sessions.destroy_all': { paramsTuple?: []; params?: {} }
    'workout_sessions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'profile.profile.update_password': { paramsTuple?: []; params?: {} }
    'profile.profile.update_email': { paramsTuple?: []; params?: {} }
    'workouts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercises.update': { paramsTuple: [ParamValue,ParamValue]; params: {'workoutId': ParamValue,'id': ParamValue} }
    'schedules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cycle_days.set_start_date': { paramsTuple?: []; params?: {} }
    'cycle_days.set_repeat': { paramsTuple?: []; params?: {} }
    'cycle_days.set_end_rest': { paramsTuple?: []; params?: {} }
    'workout_sessions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}