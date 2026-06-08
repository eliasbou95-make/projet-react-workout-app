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

  // groupe workout_sessions
  router
        .group(() => {
          router.post('workouts/:workoutId/sessions', [controllers.WorkoutSessions, 'store'])
          router.get('sessions', [controllers.WorkoutSessions, 'index'])
          router.get('sessions/:id', [controllers.WorkoutSessions, 'show'])
          router.patch('sessions/:id', [controllers.WorkoutSessions, 'update'])
        })
        .use(middleware.auth())

  // groupe performances
  router
        .group(() => {
          router.post('sessions/:sessionId/performances', [controllers.Performances, 'store'])
          router.get('sessions/:sessionId/performances', [controllers.Performances, 'index'])
        })
        .use(middleware.auth())

  })
  .prefix('/api/v1')
