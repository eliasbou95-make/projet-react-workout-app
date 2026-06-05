
import Workout from "#models/workout";
import { createScheduleValidator } from '#validators/schedule';
import { updateScheduleValidator } from '#validators/schedule';
import Schedule from "#models/schedule";
import { HttpContext } from "@adonisjs/core/http";



export default class SchedulesController {
    async index ({auth} : HttpContext){
        const user = auth.getUserOrFail()
        const day = await Schedule.query().where('userId' , user.id)
        return day 
    }

    async store ({auth,request} : HttpContext) {
        const user = auth.getUserOrFail()
        const dayOfWeek = await Schedule.query().where('userId', user.id)
        const {dayOfWeek,workoutId } = await request.validateUsing(createScheduleValidator)
        const newDay 

    }

}