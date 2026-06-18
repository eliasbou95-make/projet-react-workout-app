import Workout from "#models/workout";
import CycleDay from "#models/cycle_day";
import { createCycleDayValidator } from "#validators/cycle_day";
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

  // supprime un jour du cycle
  async destroy({ auth, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const cycleDay = await CycleDay.query().where('userId', user.id).where('id', params.id).firstOrFail()
    await cycleDay.delete()
    return { message: 'jour du cycle supprimé' }
  }
}
