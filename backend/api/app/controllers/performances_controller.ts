import Performance from "#models/performance";
import WorkoutSession from "#models/workout_session";
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
        const performance = await Performance.query()
            .where('exerciseId', params.exerciseId)
            .whereIn('sessionId', (sub) => {
                sub.from('workout_sessions').select('id').where('user_id', user.id)
            })
            .orderBy('createdAt', 'desc')
            .first()
        return performance
    }

}
