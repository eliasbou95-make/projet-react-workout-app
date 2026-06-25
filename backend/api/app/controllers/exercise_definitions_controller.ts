import ExerciseDefinition from "#models/exercise_definition";
import Performance from "#models/performance";
import { createExerciseDefinitionValidator } from "#validators/exercise_definition";
import { HttpContext } from "@adonisjs/core/http";

export default class ExerciseDefinitionsController {
  // liste les fiches d'exercices de l'utilisateur (ordre alphabétique)
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return ExerciseDefinition.query().where('userId', user.id).orderBy('name', 'asc')
  }

  // crée une nouvelle fiche d'exercice
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { name, icon, sectionId } = await request.validateUsing(createExerciseDefinitionValidator)
    return ExerciseDefinition.create({ userId: user.id, name, icon: icon ?? null, sectionId: sectionId ?? null })
  }

  // progression : toutes les perfs des exos qui partagent cette fiche (par date)
  async progression({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    return Performance.query()
      // les exos rattachés à cette fiche
      .whereIn('exerciseId', (sub) => {
        sub.from('exercises').select('id').where('definition_id', params.id)
      })
      // seulement les sessions de cet utilisateur
      .whereIn('sessionId', (sub) => {
        sub.from('workout_sessions').select('id').where('user_id', user.id)
      })
      .orderBy('createdAt', 'asc')
  }

  // supprime une fiche d'exercice
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const definition = await ExerciseDefinition.query()
      .where('userId', user.id)
      .where('id', params.id)
      .firstOrFail()
    await definition.delete()
    return { message: 'exercice supprimé' }
  }
}
