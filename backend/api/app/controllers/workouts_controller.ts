import Workout from "#models/workout";
import type { HttpContext } from "@adonisjs/core/http";

export default class WorkoutsController {
    async index ({auth}: HttpContext) {
        const user = auth.getUserOrFail()
        const workouts = await Workout.query().where('userId', user.id)
        return workouts
    }
}