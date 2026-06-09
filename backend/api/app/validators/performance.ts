import vine from "@vinejs/vine";

export const createPerformanceValidator = vine.create ({
    exerciseId : vine.number().min(1).max(999),
    reps : vine.number().min(1),
    weight: vine.number(),
    restTime : vine.number(),
    notes : vine.string().trim().minLength(1).maxLength(100).optional()
})