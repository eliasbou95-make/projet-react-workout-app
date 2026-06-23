import Performance from "#models/performance";
import WorkoutSession from "#models/workout_session";
import Exercise from "#models/exercise";
import { createPerformanceValidator } from "#validators/performance";
import { HttpContext } from "@adonisjs/core/http";

export default class PerformancesController {

    async store({auth, request, params} : HttpContext) {
        const user = auth.getUserOrFail()
        const session = await WorkoutSession.query()
            .where('userId', user.id)
            .where('id', params.sessionId)
            .firstOrFail()
        const { exerciseId, reps, weight, restTime, notes } = await request.validateUsing(createPerformanceValidator)
        const performance = await Performance.create({
            sessionId: session.id,
            exerciseId,
            reps,
            weight: weight?.toString(),
            restTime,
            notes,
        })
        return performance
    }

    async index({auth, params} : HttpContext) {
        const user = auth.getUserOrFail()
        const session = await WorkoutSession.query()
            .where('userId', user.id)
            .where('id', params.sessionId)
            .firstOrFail()
        const performances = await Performance.query().where('sessionId', session.id)
        return performances
    }

    async last({auth, params} : HttpContext) {
        const user = auth.getUserOrFail()

        // l'exo courant, pour récupérer sa fiche (definition_id)
        const exercise = await Exercise.query().where('id', params.exerciseId).first()

        // par défaut on ne regarde que cet exo ; s'il est homologué (definition_id),
        // on élargit à TOUS les exos qui partagent la même fiche → historique partagé
        let exerciseIds = [Number(params.exerciseId)]
        if (exercise?.definitionId) {
            const freres = await Exercise.query().where('definitionId', exercise.definitionId).select('id')
            exerciseIds = freres.map((e) => e.id)
        }

        const performance = await Performance.query()
            .whereIn('exerciseId', exerciseIds)
            .whereIn('sessionId', (sub) => {
                sub.from('workout_sessions').select('id').where('user_id', user.id)
            })
            .orderBy('createdAt', 'desc')
            .first()
        return performance
    }

}
