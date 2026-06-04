import vine from '@vinejs/vine'

/**
 * Validator to use when creating a workout.
 * On vérifie juste que "name" est une chaîne non vide (1 à 100 caractères).
 */
export const createWorkoutValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(100),
})
