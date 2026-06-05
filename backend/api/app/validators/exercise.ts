import vine from '@vinejs/vine';


export const createExerciseValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(100),
  sets: vine.number().min(1).max(999).optional(),
  reps: vine.number().min(1).max(999).optional(),
  weight: vine.number().min(0).max(999).optional(),
  restTime: vine.number().min(0).max(999).optional(),
  notes: vine.string().trim().minLength(1).optional()
})

export const updateExerciseValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(100).optional(),
  sets: vine.number().min(1).max(999).optional(),
  reps: vine.number().min(1).max(999).optional(),
  weight: vine.number().min(0).max(999).optional(),
  restTime: vine.number().min(0).max(999).optional(),
  notes: vine.string().trim().minLength(1).optional()
})