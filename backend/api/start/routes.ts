/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'


router.get('/', () => {
  return { hello: 'world !' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
        router.delete('reset', [controllers.Profile, 'reset'])
        router.patch('password', [controllers.Profile, 'updatePassword'])
        router.patch('email', [controllers.Profile, 'updateEmail'])
        router.delete('delete', [controllers.Profile, 'destroyAccount'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

// groupe table workouts
    router
      .group(()=>{
      router.get('workouts', [controllers.Workouts, 'index'])
      router.post('workouts', [controllers.Workouts, 'store'])
      router.get('workouts/:id', [controllers.Workouts,'show'])
      router.delete('workouts/:id' , [controllers.Workouts, 'destroy'])
      router.patch('workouts/:id' , [controllers.Workouts, 'update'])
     

    })
    .use(middleware.auth())
    
// gourpe table exercice 
    router
      .group(() => {
        router.get('workouts/:workoutId/exercises' , [controllers.Exercises, 'index'] )
        router.post('workouts/:workoutId/exercises', [controllers.Exercises, 'store'])
        router.get('workouts/:workoutId/exercises/:id', [controllers.Exercises,'show'])
        router.delete('workouts/:workoutId/exercises/:id' , [controllers.Exercises, 'destroy'])
        router.patch('workouts/:workoutId/exercises/:id' , [controllers.Exercises, 'update'])
      })
      .use(middleware.auth())
// groupe table shedules 
      router
        .group(() => {
          router.get('schedules', [controllers.Schedules, 'index'] )
          router.post ('schedules', [controllers.Schedules, 'store' ])
          router.patch ('schedules/:id', [controllers.Schedules, 'update'])
          router.delete ('schedules/:id', [controllers.Schedules, 'destroy'])
        })
        .use(middleware.auth())

// groupe cycle (nouveau planning qui boucle)
      router
        .group(() => {
          router.get('cycle', [controllers.CycleDays, 'index'])
          router.post('cycle', [controllers.CycleDays, 'store'])
          router.patch('cycle/start-date', [controllers.CycleDays, 'setStartDate'])
          router.patch('cycle/repeat', [controllers.CycleDays, 'setRepeat'])
          router.patch('cycle/end-rest', [controllers.CycleDays, 'setEndRest'])
          router.delete('cycle/:id', [controllers.CycleDays, 'destroy'])
        })
        .use(middleware.auth())

// groupe exercise_definitions (fiches d'exercices homologués)
      router
        .group(() => {
          router.get('exercise-definitions', [controllers.ExerciseDefinitions, 'index'])
          router.post('exercise-definitions', [controllers.ExerciseDefinitions, 'store'])
          router.get('exercise-definitions/:id/performances', [controllers.ExerciseDefinitions, 'progression'])
          router.delete('exercise-definitions/:id', [controllers.ExerciseDefinitions, 'destroy'])
        })
        .use(middleware.auth())

// groupe sections (classeurs de rangement des exos)
      router
        .group(() => {
          router.get('sections', [controllers.Sections, 'index'])
          router.post('sections', [controllers.Sections, 'store'])
          router.delete('sections/:id', [controllers.Sections, 'destroy'])
        })
        .use(middleware.auth())

// groupe day_overrides (exceptions : changer la séance d'un jour précis)
      router
        .group(() => {
          router.get('day-overrides', [controllers.DayOverrides, 'index'])
          router.post('day-overrides', [controllers.DayOverrides, 'upsert'])
        })
        .use(middleware.auth())

  // groupe workout_sessions
  router
        .group(() => {
          router.post('workouts/:workoutId/sessions', [controllers.WorkoutSessions, 'store'])
          router.post('workouts/:workoutId/sessions/skip', [controllers.WorkoutSessions, 'skip'])
          router.post('workouts/:workoutId/sessions/complete', [controllers.WorkoutSessions, 'complete'])
          router.post('workouts/:workoutId/sessions/reset', [controllers.WorkoutSessions, 'reset'])
          router.get('sessions', [controllers.WorkoutSessions, 'index'])
          router.get('sessions/:id', [controllers.WorkoutSessions, 'show'])
          router.patch('sessions/:id', [controllers.WorkoutSessions, 'update'])
          router.delete('sessions', [controllers.WorkoutSessions, 'destroyAll'])
          router.delete('sessions/:id', [controllers.WorkoutSessions, 'destroy'])
        })
        .use(middleware.auth())

  // groupe performances
  router
        .group(() => {
          router.post('sessions/:sessionId/performances', [controllers.Performances, 'store'])
          router.get('sessions/:sessionId/performances', [controllers.Performances, 'index'])
          router.get('exercises/:exerciseId/last-performance', [controllers.Performances, 'last'])
        })
        .use(middleware.auth())

  })
  .prefix('/api/v1')
