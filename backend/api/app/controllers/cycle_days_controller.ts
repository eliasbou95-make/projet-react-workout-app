import Workout from "#models/workout";
import CycleDay from "#models/cycle_day";
import { createCycleDayValidator, setCycleStartDateValidator, setCycleRepeatValidator, setCycleEndRestValidator } from "#validators/cycle_day";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

export default class CycleDaysController {
  // liste les jours du cycle, dans l'ordre
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return CycleDay.query().where('userId', user.id).orderBy('position', 'asc')
  }

  // ajoute un jour au cycle (workoutId absent/null = jour de repos)
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { position, workoutId } = await request.validateUsing(createCycleDayValidator)

    if (workoutId) {
      await Workout.query().where('userId', user.id).where('id', workoutId).firstOrFail()
    }

    // tout premier jour du cycle → on ancre la date de départ à aujourd'hui
    const existant = await CycleDay.query().where('userId', user.id).first()
    if (!existant) {
      user.cycleStartDate = DateTime.now()
      await user.save()
    }

    return CycleDay.create({ userId: user.id, position, workoutId: workoutId ?? null })
  }

  // change la date de début du cycle (le point d'ancrage sur le calendrier)
  async setStartDate({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { cycleStartDate } = await request.validateUsing(setCycleStartDateValidator)
    user.cycleStartDate = DateTime.fromISO(cycleStartDate)
    await user.save()
    return user
  }

  // change le nombre de répétitions du cycle (null = infini)
  async setRepeat({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { cycleRepeat } = await request.validateUsing(setCycleRepeatValidator)
    user.cycleRepeat = cycleRepeat ?? null
    await user.save()
    return user
  }

  // active/désactive le jour de repos automatique en fin de cycle
  async setEndRest({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const { cycleEndRest } = await request.validateUsing(setCycleEndRestValidator)
    user.cycleEndRest = cycleEndRest
    await user.save()
    return user
  }

  // supprime un jour du cycle
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const cycleDay = await CycleDay.query().where('userId', user.id).where('id', params.id).firstOrFail()
    await cycleDay.delete()
    return { message: 'jour du cycle supprimé' }
  }
}
