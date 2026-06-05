import vine from '@vinejs/vine';

export const createScheduleValidator  = vine.create({
    dayOfWeek : vine.number().min(1).max(7),
    workoutId : vine.number()
})

export const updateScheduleValidator  = vine.create({
    dayOfWeek : vine.number().min(1).max(7).optional(),
    workoutId : vine.number().optional()
})