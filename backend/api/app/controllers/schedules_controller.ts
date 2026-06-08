
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

    async store ({auth,request,response } : HttpContext) {
        const user = auth.getUserOrFail()
        const {dayOfWeek,workoutId} = await request.validateUsing(createScheduleValidator)
        await Workout.query()
                .where('userId', user.id)
                .where('id',workoutId)
                .firstOrFail()
        const existing = await Schedule.query().where('userId', user.id).where("dayOfWeek", dayOfWeek).first()
        if (existing) {
            return response.conflict({ message: 'ce jour est déja planifié '})
        }
        const schedule = await Schedule.create({
            userId: user.id,
            dayOfWeek,
            workoutId,
        })
        return schedule
    }

    async destroy({auth,params} : HttpContext) {
        const user = auth.getUserOrFail()
        const schedule = await Schedule.query()
            .where('userId', user.id)
            .where("id",params.id)
            .firstOrFail()
        await schedule.delete()
        return {message: 'jour libéré '}
    }

    async update({auth,request,params}: HttpContext) {
        const user = auth.getUserOrFail()
        const schedule = await Schedule.query()
            .where('userId', user.id)
            .where("id",params.id)
            .firstOrFail()
        const payload = await request.validateUsing(updateScheduleValidator)
        schedule.merge(payload)
        await schedule.save() 
        return schedule 
            
    }

}