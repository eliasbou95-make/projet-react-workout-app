import Workout from "#models/workout";
import WorkoutSession from "#models/workout_session";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from 'luxon'


export default class WorkoutSessionsController {

    async store({auth,params} : HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
            .where('userId', user.id)
            .where('id', params.workoutId)
            .firstOrFail()
        const session = await WorkoutSession.create({
            userId: user.id,
            workoutId: workout.id,
            startedAt: DateTime.now(),
        })
        return session
    }

    async index ({auth} : HttpContext){
        const user = auth.getUserOrFail()
        const session = await WorkoutSession.query()
        .where('userId',user.id)
        .whereNotNull('completedAt')
        return session

    }

    async show ({auth,params} : HttpContext ){
        const user = auth.getUserOrFail()
        const sessions = await WorkoutSession.query().where('userId', user.id)
        .where('id', params.id).firstOrFail()
        return sessions 
    }

    async update ({auth,params}: HttpContext){
        const user = auth.getUserOrFail()
        const session = await WorkoutSession.query().where('userId', user.id).where('id', params.id).firstOrFail()
        session.completedAt = DateTime.now()
        await session.save()
        return session 
    }

}