import { WorkoutSchema } from "#database/schema"
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Exercise from '#models/exercise'

export default class Workout extends WorkoutSchema {
  @hasMany(() => Exercise)
  declare exercises: HasMany<typeof Exercise>
}
