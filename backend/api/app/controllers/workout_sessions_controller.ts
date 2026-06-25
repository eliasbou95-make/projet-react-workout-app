import Workout from "#models/workout";
import WorkoutSession from "#models/workout_session";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from 'luxon'


export default class WorkoutSessionsController {

    async store({auth,params,request} : HttpContext) {
        const user = auth.getUserOrFail()
        const workout = await Workout.query()
            .where('userId', user.id)
            .where('id', params.workoutId)
            .firstOrFail()
        // jour du calendrier visé (optionnel) : envoyé par le front au démarrage
        const scheduledDate = request.input('scheduledDate')
        // on relance ce jour : on enlève d'abord un éventuel marqueur (reset/skip) du même jour
        if (scheduledDate) {
            await WorkoutSession.query().where('userId', user.id).where('workoutId', workout.id).where('scheduledDate', scheduledDate).delete()
        }
        const session = await WorkoutSession.create({
            userId: user.id,
            workoutId: workout.id,
            startedAt: DateTime.now(),
            scheduledDate: scheduledDate ? DateTime.fromISO(scheduledDate) : null,
        })
        return session
    }

    async index ({auth} : HttpContext){
        const user = auth.getUserOrFail()
        // on renvoie les séances finies OU annulées (le calendrier en a besoin ;
        // l'historique filtrera pour ne garder que les finies)
        const session = await WorkoutSession.query()
        .where('userId',user.id)
        .where((q) => {
            q.whereNotNull('completedAt').orWhereIn('status', ['skipped', 'reset'])
        })
        return session

    }

    // marque la séance d'un jour comme ANNULÉE (skip), même à l'avance
    async skip ({auth, params, request} : HttpContext){
        const user = auth.getUserOrFail()
        const workout = await Workout.query().where('userId', user.id).where('id', params.workoutId).firstOrFail()
        const scheduledDate = request.input('scheduledDate')
        // un seul état par jour : on nettoie d'abord
        await WorkoutSession.query().where('userId', user.id).where('workoutId', workout.id).where('scheduledDate', scheduledDate).delete()
        return WorkoutSession.create({
            userId: user.id,
            workoutId: workout.id,
            scheduledDate: scheduledDate ? DateTime.fromISO(scheduledDate) : null,
            status: 'skipped',
        })
    }

    // marque la séance d'un jour comme FINIE, sans aucune perf
    async complete ({auth, params, request} : HttpContext){
        const user = auth.getUserOrFail()
        const workout = await Workout.query().where('userId', user.id).where('id', params.workoutId).firstOrFail()
        const scheduledDate = request.input('scheduledDate')
        await WorkoutSession.query().where('userId', user.id).where('workoutId', workout.id).where('scheduledDate', scheduledDate).delete()
        return WorkoutSession.create({
            userId: user.id,
            workoutId: workout.id,
            startedAt: DateTime.now(),
            completedAt: DateTime.now(),
            scheduledDate: scheduledDate ? DateTime.fromISO(scheduledDate) : null,
            status: 'completed',
        })
    }

    // réinitialise la séance d'un jour : on efface tout, puis on pose un marqueur 'reset'
    // (= jour volontairement ignoré) pour que la croix automatique ne réapparaisse pas
    async reset ({auth, params, request} : HttpContext){
        const user = auth.getUserOrFail()
        const workout = await Workout.query().where('userId', user.id).where('id', params.workoutId).firstOrFail()
        const scheduledDate = request.input('scheduledDate')
        await WorkoutSession.query().where('userId', user.id).where('workoutId', workout.id).where('scheduledDate', scheduledDate).delete()
        return WorkoutSession.create({
            userId: user.id,
            workoutId: workout.id,
            scheduledDate: scheduledDate ? DateTime.fromISO(scheduledDate) : null,
            status: 'reset',
        })
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

    // supprime UNE séance de l'historique (ses perfs partent en cascade)
    async destroy ({auth,params}: HttpContext){
        const user = auth.getUserOrFail()
        const session = await WorkoutSession.query().where('userId', user.id).where('id', params.id).firstOrFail()
        await session.delete()
        return { message: 'séance supprimée' }
    }

    // vide tout l'historique (toutes les séances terminées de l'utilisateur)
    async destroyAll ({auth}: HttpContext){
        const user = auth.getUserOrFail()
        await WorkoutSession.query().where('userId', user.id).whereNotNull('completedAt').delete()
        return { message: 'historique vidé' }
    }

}