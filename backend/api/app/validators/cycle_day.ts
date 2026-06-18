import vine from "@vinejs/vine";

export const createCycleDayValidator = vine.create({
    position: vine.number().min(0),
    workoutId: vine.number().min(1).nullable().optional(),

})