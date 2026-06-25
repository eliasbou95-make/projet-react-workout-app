import UserTransformer from '#transformers/user_transformer'
import Workout from '#models/workout'
import Exercise from '#models/exercise'
import WorkoutSession from '#models/workout_session'
import Performance from '#models/performance'
import ExerciseDefinition from '#models/exercise_definition'
import Section from '#models/section'
import CycleDay from '#models/cycle_day'
import DayOverride from '#models/day_override'
import {
  changePasswordValidator,
  changeEmailValidator,
  deleteAccountValidator,
} from '#validators/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

// efface TOUTES les données d'entraînement d'un utilisateur (dans le bon ordre pour les FK)
async function effacerDonnees(userId: number) {
  // perfs liées aux sessions de l'utilisateur
  await Performance.query()
    .whereIn('sessionId', (sub) => {
      sub.from('workout_sessions').select('id').where('user_id', userId)
    })
    .delete()
  // perfs liées aux exercices des workouts de l'utilisateur (sécurité)
  await Performance.query()
    .whereIn('exerciseId', (sub) => {
      sub
        .from('exercises')
        .select('id')
        .whereIn('workout_id', (s2) => {
          s2.from('workouts').select('id').where('user_id', userId)
        })
    })
    .delete()

  await WorkoutSession.query().where('userId', userId).delete()
  await DayOverride.query().where('userId', userId).delete()
  await CycleDay.query().where('userId', userId).delete()

  await Exercise.query()
    .whereIn('workoutId', (sub) => {
      sub.from('workouts').select('id').where('user_id', userId)
    })
    .delete()
  await Workout.query().where('userId', userId).delete()

  await ExerciseDefinition.query().where('userId', userId).delete()
  await Section.query().where('userId', userId).delete()
}

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  // RÉINITIALISATION TOTALE des données (le compte reste). Irréversible.
  async reset({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await effacerDonnees(user.id)
    user.cycleStartDate = null
    user.cycleRepeat = null
    user.cycleEndRest = false
    await user.save()
    return { message: 'tout a été réinitialisé' }
  }

  // changer le mot de passe (après vérification du mot de passe actuel)
  async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)
    const ok = await hash.verify(user.password, currentPassword)
    if (!ok) return response.unauthorized({ message: 'Mot de passe actuel incorrect' })
    user.password = newPassword // re-hashé automatiquement au save()
    await user.save()
    return { message: 'mot de passe modifié' }
  }

  // changer l'email (après vérification du mot de passe)
  async updateEmail({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { password, email } = await request.validateUsing(changeEmailValidator)
    const ok = await hash.verify(user.password, password)
    if (!ok) return response.unauthorized({ message: 'Mot de passe incorrect' })
    user.email = email
    await user.save()
    return { message: 'email modifié' }
  }

  // SUPPRIMER le compte : efface les données puis le compte lui-même. Définitif.
  async destroyAccount({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { password } = await request.validateUsing(deleteAccountValidator)
    const ok = await hash.verify(user.password, password)
    if (!ok) return response.unauthorized({ message: 'Mot de passe incorrect' })
    await effacerDonnees(user.id)
    await user.delete()
    return { message: 'compte supprimé' }
  }
}
