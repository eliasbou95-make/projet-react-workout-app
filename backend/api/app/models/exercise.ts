import { ExerciseSchema } from "#database/schema"
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Workout from '#models/workout'

export default class Exercise extends ExerciseSchema {
  // un exercice appartient à UN workout
  @belongsTo(() => Workout)
  declare workout: BelongsTo<typeof Workout>
}
