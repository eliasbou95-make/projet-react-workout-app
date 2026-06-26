import DayOverride from "#models/day_override";
import Workout from "#models/workout";
import { upsertDayOverrideValidator } from "#validators/day_override";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

export default class DayOverridesController {
  // liste les exceptions de jour de l'utilisateur (pour les afficher dans le calendrier)
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return DayOverride.query().where('userId', user.id)
  }

  // crée OU remplace l'exception d'un jour (workoutId = séance choisie, ou null = repos forcé)
  async upsert({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { date, workoutId } = await request.validateUsing(upsertDayOverrideValidator)

    // sécurité : si une séance est fournie, elle doit appartenir à l'utilisateur
    // (sinon on pourrait pointer son calendrier vers la séance de quelqu'un d'autre)
    if (workoutId) {
      await Workout.query().where('userId', user.id).where('id', workoutId).firstOrFail()
    }

    // existe-t-il déjà une exception pour ce jour ? (la chaîne 'YYYY-MM-DD' se compare bien à une colonne date)
    const existante = await DayOverride.query()
      .where('userId', user.id)
      .where('date', date)
      .first()

    if (existante) {
      existante.workoutId = workoutId ?? null
      await existante.save()
      return existante
    }

    return DayOverride.create({
      userId: user.id,
      date: DateTime.fromISO(date),   // Adonis exige un DateTime Luxon pour une colonne date
      workoutId: workoutId ?? null,
    })
  }
}
