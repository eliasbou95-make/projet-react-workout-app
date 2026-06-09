import Workout from "#models/workout";
import { createWorkoutValidator } from "#validators/workout";
import type { HttpContext } from "@adonisjs/core/http";

export default class WorkoutsController {
    //liste les workouts de l'utilisateur connecté
    async index ({auth}: HttpContext) {
        const user = auth.getUserOrFail()
        const workouts = await Workout.query().where('userId', user.id)
        return workouts
    }

    //crée un nouveau workout pour l'utilisateur connecté
    async store ({auth, request}: HttpContext) {
        const user = auth.getUserOrFail()                                  // ① qui crée ?
        const { name } = await request.validateUsing(createWorkoutValidator) // ② valide l'entrée
        const workout = await Workout.create({ name, userId: user.id })    // ③ écrit en base
        return workout                                                     // ④ renvoie le créé
    }

    //affiche UN workout précis de l'utilisateur connecté
    async show({auth, params} : HttpContext) {
        const user = auth.getUserOrFail()                  
        const workout = await Workout.query()              
            .where('userId', user.id)                     
            .where('id', params.id)                        
            .firstOrFail()                                
        return workout                                    
    }
 // supprime les workout 
    async destroy({auth, params} : HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()              
            .where('userId', user.id)                     
            .where('id', params.id)                        
            .firstOrFail()  
        await workout.delete()
        return {message: 'workout supprimé'}
    }

//update les workout 
    async update({auth, params , request} : HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()              
            .where('userId', user.id)                     
            .where('id', params.id)                        
            .firstOrFail() 
        const { name } = await request.validateUsing(createWorkoutValidator)
        workout.name = name 
        await workout.save()
        return workout
    }
}