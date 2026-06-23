import vine from "@vinejs/vine";

export const createCycleDayValidator = vine.create({
    position: vine.number().min(0),
    workoutId: vine.number().min(1).nullable().optional(),

})

export const setCycleStartDateValidator = vine.create({
    cycleStartDate: vine.string().trim(),   // date ISO 'YYYY-MM-DD' envoyée par le front
})

export const setCycleRepeatValidator = vine.create({
    cycleRepeat: vine.number().min(1).max(999).nullable().optional(),   // null = infini
})

export const setCycleEndRestValidator = vine.create({
    cycleEndRest: vine.boolean(),   // y a-t-il un repos de fin de cycle ?
})