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




  })
  .prefix('/api/v1')
