import { createExerciseValidator } from "#validators/exercise";
import type { HttpContext } from "@adonisjs/core/http";
import Workout from "#models/workout";
import Exercise from "#models/exercise";
import ExerciseDefinition from "#models/exercise_definition";
import { updateExerciseValidator } from "#validators/exercise";

export default class ExercisesController {

    // ajoute un exercice dans un workout 
    async store({ auth, request, params }: HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
            .where('userId', user.id)
            .where('id', params.workoutId)
            .firstOrFail()
             let { name, sets, reps, weight, restTime, notes, definitionId } = await request.validateUsing(createExerciseValidator)

        // sécurité : si une fiche est fournie par le client, elle doit appartenir à l'utilisateur
        if (definitionId) {
            await ExerciseDefinition.query().where('userId', user.id).where('id', definitionId).firstOrFail()
        }

        // auto-homologation : si aucune fiche fournie, on la retrouve par nom (même utilisateur)
        if (!definitionId) {
            const def = await ExerciseDefinition.query()
                .where('userId', user.id)
                .whereRaw('lower(trim(name)) = lower(trim(?))', [name])
                .first()
            if (def) definitionId = def.id
        }

        const exercise = await workout.related('exercises').create({ name, sets, reps, weight: weight?.toString(), restTime, notes, definitionId: definitionId ?? null })
        return exercise
    }

    // liste les exercices 
    async index ({auth,params}:HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
            .where('userId', user.id)
            .where('id', params.workoutId)
            .firstOrFail()
        const exercises = await workout.related('exercises').query()
        return exercises 
    }

    // supprimer un exo 
    async destroy ({auth,params} : HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
        .where('userId', user.id)
        .where('id',params.workoutId)
        .firstOrFail()
        const exercise = await Exercise.query()
            .where('workoutId', workout.id)
            .where('id', params.id)
            .firstOrFail()
        await exercise.delete()
        return {message : 'exercice supprimé'}

    }

    // voir un exo précis 
    async show ({auth,params}: HttpContext) {
        const user = auth.getUserOrFail()
            const workout = await Workout.query()
        .where('userId', user.id)
        .where('id',params.workoutId)
        .firstOrFail()
        const exercise = await Exercise.query()
            .where('workoutId', workout.id)
            .where('id', params.id)
            .firstOrFail()
        return exercise

    }

    async update ({auth,params,request}: HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
        .where('userId', user.id)
        .where('id',params.workoutId)
        .firstOrFail()
        const exercise = await Exercise.query()
            .where('workoutId', workout.id)
            .where('id', params.id)
            .firstOrFail()
        const payload = await request.validateUsing(updateExerciseValidator)
        exercise.merge ({...payload, weight: payload.weight?.toString() })
        await exercise.save()
        return  exercise
    }

}
